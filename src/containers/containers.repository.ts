import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContainersRepository {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.container.create({ data });
  }

  findAll() {
    return this.prisma.container.findMany({ include: { zone: true } });
  }

  findById(id: number) {
    return this.prisma.container.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.container.update({ where: { id }, data });
  }
}
