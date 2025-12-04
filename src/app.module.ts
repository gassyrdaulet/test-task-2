import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContainersModule } from './containers/containers.module';
import { ZonesModule } from './zones/zones.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ContainersModule,
    ZonesModule
  ],
})
export class AppModule {}
