import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ContainersRepository } from './containers.repository';
import { ZonesRepository } from '../zones/zones.repository';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ContainersService {
  constructor(
    private containersRepo: ContainersRepository,
    private zonesRepo: ZonesRepository,
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async create(dto: { number: string; type: string; status?: string; zoneId?: number }) {
    if (dto.zoneId) {
      const zone = await this.zonesRepo.findById(dto.zoneId);
      if (!zone) throw new NotFoundException('Zone not found');

      if (zone.current_load + 1 > zone.capacity) {
        throw new BadRequestException('Zone Overloaded');
      }
      const [container] = await this.prisma.$transaction([
        this.prisma.container.create({ data: { number: dto.number, type: dto.type, status: dto.status ?? 'stored', zoneId: dto.zoneId } }),
        this.prisma.zone.update({ where: { id: dto.zoneId }, data: { current_load: zone.current_load + 1 } }),
      ]);
      this.eventsGateway && this.eventsGateway.server.emit('container.created', container);
      return container;
    }

    const container = await this.containersRepo.create({
      number: dto.number,
      type: dto.type,
      status: dto.status ?? 'incoming',
      zoneId: null,
    });
    this.eventsGateway && this.eventsGateway.server.emit('container.created', container);
    return container;
  }

  async list() {
    return this.containersRepo.findAll();
  }

  async updateStatus(id: number, status: string) {
    const container = await this.containersRepo.findById(id);
    if (!container) throw new NotFoundException('Container not found');

    if (container.zoneId) {
      const zone = await this.zonesRepo.findById(container.zoneId);
      if (!zone) throw new NotFoundException('Zone not found');

      const [updatedContainer] = await this.prisma.$transaction([
        this.prisma.container.update({ where: { id }, data: { status, zoneId: null } }),
        this.prisma.zone.update({ where: { id: zone.id }, data: { current_load: Math.max(0, zone.current_load - 1) } }),
      ]);
      this.eventsGateway && this.eventsGateway.server.emit('container.updated', updatedContainer);
      return updatedContainer;
    } else {
      const updated = await this.containersRepo.update(id, { status });
      this.eventsGateway && this.eventsGateway.server.emit('container.updated', updated);
      return updated;
    }
  }

  async assignToZone(zoneId: number, containerId: number) {
    const zone = await this.zonesRepo.findById(zoneId);
    if (!zone) throw new NotFoundException('Zone not found');

    const container = await this.containersRepo.findById(containerId);
    if (!container) throw new NotFoundException('Container not found');

    if (container.zoneId === zoneId) return container; // уже там

    if (zone.current_load + 1 > zone.capacity) {
      throw new BadRequestException('Zone Overloaded');
    }

    const [updatedContainer] = await this.prisma.$transaction([
      this.prisma.container.update({ where: { id: containerId }, data: { zoneId } }),
      this.prisma.zone.update({ where: { id: zoneId }, data: { current_load: zone.current_load + 1 } }),
    ]);

    this.eventsGateway && this.eventsGateway.server.emit('container.assigned', { container: updatedContainer, zoneId });
    return updatedContainer;
  }
}
