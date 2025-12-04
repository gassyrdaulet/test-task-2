import { Module, forwardRef } from "@nestjs/common";
import { ZonesService } from "./zones.service";
import { ContainersModule } from "src/containers/containers.module";
import { ZonesRepository } from "./zones.repository";
import { PrismaService } from "src/prisma/prisma.service";
import { ZonesController } from "./zones.controller";

@Module({
  imports: [forwardRef(() => ContainersModule)],
  controllers: [ZonesController],
  providers: [ZonesService, ZonesRepository, PrismaService],
  exports: [ZonesService, ZonesRepository],
})
export class ZonesModule {}