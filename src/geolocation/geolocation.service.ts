import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { haversineDistance } from './common/utils/distance';

import { GetNearUsersDto } from './dto/get-near-users.dto';
import { SaveUserPositionDto } from './dto/save-user-position.dto';
import { Geolocation } from './schemas/geolocation.schema';
import { User } from './schemas/user.schema';
import * as users from './database/seed/users.json';
import * as geolocations from './database/seed/geolocations.json';

@Injectable()
export class GeolocationService {
  private DEFAULT_MAX_DISTANCE = 5000;

  constructor(
    @InjectModel('Geolocation')
    private readonly geolocationModel: Model<Geolocation>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}

  async seedDatabase(options: Object) {
    if (
      !(
        options.hasOwnProperty('geolocations') &&
        options.hasOwnProperty('users')
      )
    )
      throw new Error('Missing option("geolocations" or "users")');

    await this.geolocationModel.deleteMany({});
    await this.userModel.deleteMany({});
    if (options['geolocations'] === '1')
      await this.geolocationModel.create(geolocations);
    if (options['users'] === '1') await this.userModel.create(users);
  }

  async savePosition(positionDto: SaveUserPositionDto): Promise<Object> {
    const geolocation = new this.geolocationModel(positionDto);
    return await geolocation.save();
  }

  async getNearUsers(nearUser: GetNearUsersDto) {
    const geolocations = await this.geolocationModel.find({
      user: { $ne: nearUser.user },
      updatedAt: {
        $gte: new Date(nearUser.startDate),
        $lt: new Date(nearUser.endDate),
      },
    });
    const nearPositions = [];
    for (const geolocation of geolocations) {
      const distance = haversineDistance(
        nearUser.coordinates,
        geolocation.coordinates,
      );
      if (
        distance < this.DEFAULT_MAX_DISTANCE &&
        !nearPositions.includes(geolocation.user)
      ) {
        nearPositions.push({ user: geolocation.user, distance: distance });
      }
    }

    const users = await this.userModel.find({
      _id: { $in: nearPositions.map((user) => user.user) },
    });

    const nearUsers = nearPositions.map((nearPos) => {
      nearPos.user = users.filter(
        (user) => user._id.valueOf() === nearPos.user.valueOf(),
      );
      return nearPos;
    });

    return nearUsers.sort((a, b) =>
      a.distance !== b.distance ? (a.distance < b.distance ? -1 : 1) : 0,
    );
  }
}
