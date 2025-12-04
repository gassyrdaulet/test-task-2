import { Module, forwardRef } from "@nestjs/common";
import { ContainersService } from "./containers.service";
import { ContainersRepository } from "./containers.repository";
import { PrismaService } from "src/prisma/prisma.service";
import { EventsGateway } from "src/events/events.gateway";
import { ContainersController } from "./containers.controller";
import { ZonesModule } from "src/zones/zones.module";

@Module({
  imports: [forwardRef(() => ZonesModule)],
  controllers: [ContainersController],
  providers: [
    ContainersService, 
    ContainersRepository,
    PrismaService,
    EventsGateway
  ],
  exports: [ContainersService],
})
export class ContainersModule {}