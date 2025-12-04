import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ContainersService } from './containers.service';

@Controller('containers')
export class ContainersController {
  constructor(private svc: ContainersService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Post()
  create(@Body() dto: { number: string; type: string; zoneId?: number; status?: string }) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { status: string }) {
    return this.svc.updateStatus(id, body.status);
  }

  // endpoint для assign через /zones/:id/assign будет проксировать сюда — либо можно вызывать напрямую zones.controller
}
