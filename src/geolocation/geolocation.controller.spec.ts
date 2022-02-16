import { Test, TestingModule } from '@nestjs/testing';
import { GeolocationController } from './geolocation.controller';
import { GeolocationService } from './geolocation.service';

class GeolocationServiceMock {
  constructor() {}
}

describe('GeolocationController', () => {
  let controller: GeolocationController;

  beforeEach(async () => {
    const GeolocationServiceProvider = {
      provide: GeolocationService,
      useClass: GeolocationServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeolocationController],
      providers: [GeolocationServiceProvider],
    }).compile();

    controller = module.get<GeolocationController>(GeolocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
