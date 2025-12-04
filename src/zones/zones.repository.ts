import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZonesRepository {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; capacity: number; type: string }) {
    return this.prisma.zone.create({ data });
  }

  findAll() {
    return this.prisma.zone.findMany({ include: { containers: true } });
  }

  findById(id: number) {
    return this.prisma.zone.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.zone.update({ where: { id }, data });
  }
}
