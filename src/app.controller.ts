import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('reset/:matricula/:cpf/:data')
  async getHello(@Param('matricula') matricula: string,@Param('cpf') cpf: string @Param('data') data: string ) {
    return await this.appService.reset(matricula,cpf,data);
  }
@Get('teste')
async getT(){
	return 'OK';
}	
}
