import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { DatabaseSeeder } from '@database/seeders';
import { ResponseHttpModel } from '@shared/models';
import { PublicRoute } from '@auth/decorators';
import * as Bcrypt from 'bcrypt';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private databaseSeeder: DatabaseSeeder
  ) {}

  @PublicRoute()
  @Get('init')
  async init(): Promise<ResponseHttpModel> {
    await this.databaseSeeder.run();

    return {
      data: true,
      message: '',
      title: '',
    };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @PublicRoute()
  @Post('utils/hash-password')
  async hashPassword(@Body() body: { password: string }): Promise<any> {
    const hashedPassword = Bcrypt.hashSync(body.password, 10);
    console.log('🔐 Contraseña original:', body.password);
    console.log('🔒 Hash generado:', hashedPassword);
    
    // Verificar que funciona correctamente
    const isMatch = Bcrypt.compareSync(body.password, hashedPassword);
    console.log('✅ Verificación de contraseña:', isMatch);
    
    return {
      originalPassword: body.password,
      hashedPassword: hashedPassword,
      verification: isMatch
    };
  }
}
