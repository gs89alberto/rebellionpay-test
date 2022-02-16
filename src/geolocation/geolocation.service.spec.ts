import { Test, TestingModule } from '@nestjs/testing';
import { GeolocationService } from './geolocation.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Model, disconnect } from 'mongoose';
import { Geolocation, GeolocationSchema } from './schemas/geolocation.schema';
import { SaveUserPositionDto } from './dto/save-user-position.dto';
import { User, UserSchema } from './schemas/user.schema';
import { GetNearUsersDto } from './dto/get-near-users.dto';

describe('GeolocationService', () => {
  let service: GeolocationService;
  let geolocationModel: Model<Geolocation>;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_DB_URL_TEST),
        MongooseModule.forFeature([
          { name: 'User', schema: UserSchema },
          { name: 'Geolocation', schema: GeolocationSchema },
        ]),
      ],
      providers: [
        GeolocationService,
        {
          provide: getModelToken('Geolocation'),
          useValue: geolocationModel,
        },
        {
          provide: getModelToken('User'),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<GeolocationService>(GeolocationService);
    geolocationModel = module.get<Model<Geolocation>>('GeolocationModel');
    userModel = module.get<Model<User>>('UserModel');

    await geolocationModel.deleteMany({});
    await userModel.deleteMany({});
  });

  afterAll((done) => {
    disconnect();
    done();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Test DB is correctly seeded', async () => {
    expect(await geolocationModel.countDocuments({})).toEqual(0);
    expect(await userModel.countDocuments({})).toEqual(0);

    await service.seedDatabase({ geolocations: '1', users: '1' });

    expect(await geolocationModel.countDocuments()).toEqual(5);
    expect(await userModel.countDocuments()).toEqual(3);
  });

  it('should save position into Test DB', async () => {
    const position: SaveUserPositionDto = {
      msg: 'position',
      user: '555555555555555555555555',
      coordinates: [1, 2],
    };

    await service.savePosition(position);
    const storedPosition = await geolocationModel.findOne({
      user: '555555555555555555555555',
    });
    expect(position.coordinates).toEqual(storedPosition.coordinates);
  });

  it('should retrieve near users from Test DB', async () => {
    await service.seedDatabase({ geolocations: '1', users: '1' });
    const nearUser: GetNearUsersDto = {
      msg: 'near',
      user: '3',
      coordinates: [40.43214797890213, -3.6664397129075717],
      startDate: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
    };
    const nearUsers = await service.getNearUsers(nearUser);
    const nearUsersDistance = nearUsers.reduce((acc, user) => {
      acc.push(user.distance);
      return acc;
    }, []);

    const expectedUsers = [
      {
        user: {
          _id: '1',
          name: 'userTest1',
        },
        distance: 2208.363166382462,
      },
      {
        user: {
          _id: '2',
          name: 'userTest2',
        },
        distance: 2230.602151711372,
      },
    ];
    const expectedDistance = expectedUsers.reduce((acc, user) => {
      acc.push(user.distance);
      return acc;
    }, []);

    expect(nearUsersDistance).toEqual(expectedDistance);
  });
});
