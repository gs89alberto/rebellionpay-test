import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { GeolocationController } from './geolocation.controller';
import { GeolocationService } from './geolocation.service';
import { GeolocationSchema } from './schemas/geolocation.schema';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Geolocation', schema: GeolocationSchema },
      { name: 'User', schema: UserSchema },
    ]),
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://nats:4222'],
        },
      },
    ]),
  ],
  controllers: [GeolocationController],
  providers: [GeolocationService],
})
export class GeolocationModule {}
