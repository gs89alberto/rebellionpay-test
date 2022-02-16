import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { GetNearUsersDto } from './dto/get-near-users.dto';
import { SaveUserPositionDto } from './dto/save-user-position.dto';
import { GeolocationService } from './geolocation.service';

@Controller('geolocation')
export class GeolocationController {
  constructor(private geolocationService: GeolocationService) {}

  @EventPattern('seed')
  async seedDatabase(@Payload() options: Object) {
    await this.geolocationService.seedDatabase(options);
  }

  @EventPattern('position')
  async savePosition(@Payload() position: SaveUserPositionDto) {
    await this.geolocationService.savePosition(position);
  }

  @MessagePattern('near')
  getNearUsers(@Payload() data: GetNearUsersDto) {
    return this.geolocationService.getNearUsers(data);
  }
}
