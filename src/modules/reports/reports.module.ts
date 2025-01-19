import { Global, Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { DatabaseModule } from "@database";
import { PrinterService } from "./services";

@Global()
@Module({
  imports: [DatabaseModule, CacheModule.register()],
  controllers: [
  ],
  providers: [
    PrinterService,
  ],
  exports: []
})
export class ReportsModule {

}
