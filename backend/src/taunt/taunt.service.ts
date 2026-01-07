import { Injectable } from '@nestjs/common';
import { CreateTauntDto } from './dto/create-taunt.dto';
import { UpdateTauntDto } from './dto/update-taunt.dto';

@Injectable()
export class TauntService {
  create(createTauntDto: CreateTauntDto) {
    return 'This action adds a new taunt';
  }

  findAll() {
    return `This action returns all taunt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taunt`;
  }

  update(id: number, updateTauntDto: UpdateTauntDto) {
    return `This action updates a #${id} taunt`;
  }

  remove(id: number) {
    return `This action removes a #${id} taunt`;
  }
}
