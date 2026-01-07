import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TauntService } from './taunt.service';
import { CreateTauntDto } from './dto/create-taunt.dto';
import { UpdateTauntDto } from './dto/update-taunt.dto';

@Controller('taunt')
export class TauntController {
  constructor(private readonly tauntService: TauntService) {}

  @Post()
  create(@Body() createTauntDto: CreateTauntDto) {
    return this.tauntService.create(createTauntDto);
  }

  @Get()
  findAll() {
    return this.tauntService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tauntService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTauntDto: UpdateTauntDto) {
    return this.tauntService.update(+id, updateTauntDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tauntService.remove(+id);
  }
}
