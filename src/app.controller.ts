import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('reset/:matricula')
  async getHello(@Param('matricula') matricula: string) {
    return await this.appService.reset('matricula');
  }
}
