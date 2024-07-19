import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './util/nestjs/decorators/auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health-check')
  getHealthCheck(): string {
    return 'success';
  }

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
