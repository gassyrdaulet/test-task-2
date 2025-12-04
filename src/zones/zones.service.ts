import { Injectable, NotFoundException } from '@nestjs/common';
import { ZonesRepository } from './zones.repository';

@Injectable()
export class ZonesService {
  constructor(private repo: ZonesRepository) {}

  create(dto: { name: string; capacity: number; type: string }) {
    return this.repo.create(dto);
  }

  async list() {
    return this.repo.findAll();
  }
}
