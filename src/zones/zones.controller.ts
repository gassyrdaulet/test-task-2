import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ContainersService } from 'src/containers/containers.service';

@Controller('zones')
export class ZonesController {
  constructor(private svc: ZonesService, private containersSvc: ContainersService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Post()
  create(@Body() dto: { name: string; capacity: number; type: string }) {
    return this.svc.create(dto);
  }

  @Post(':id/assign')
  assign(@Param('id', ParseIntPipe) id: number, @Body() body: { containerId: number }) {
    return this.containersSvc.assignToZone(id, body.containerId);
  }
}
