import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { environments } from './environments';
import { config } from '@config';
import { AuthModule } from '@auth/modules';
import { CoreModule } from '@core/modules';
import { CommonModule } from '@common/modules';
import { MulterModule } from '@nestjs/platform-express';
import { VerifyUserMiddleware } from '@middlewares';
import { CacheModule } from '@nestjs/cache-manager';
import { ReportsModule } from "./modules/reports";
import { DatabaseModule } from '@database';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        APP_URL: Joi.string().required(),
        API_KEY: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.string().required(),
        MAIL_USERNAME: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM_ADDRESS: Joi.string().required(),
      }),
    }),
    CacheModule.register(),
    MulterModule.register({ dest: './uploads' }),
    HttpModule,
    CommonModule,
    AuthModule,
    CoreModule,
    ReportsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(VerifyUserMiddleware)
      .exclude(
        { path: 'api/v1/auth/login', method: RequestMethod.POST },
        { path: 'api/v1/auth/setup/admin', method: RequestMethod.POST },
        { path: 'api/v1/roles', method: RequestMethod.GET },
        { path: 'setup/admin', method: RequestMethod.POST }
      )
      .forRoutes(
        { path: '*', method: RequestMethod.POST },
        { path: '*', method: RequestMethod.PUT },
        { path: '*', method: RequestMethod.PATCH },
        { path: '*', method: RequestMethod.DELETE },
        { path: '*', method: RequestMethod.GET },
      );
  }
}
