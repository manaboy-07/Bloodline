import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TauntService } from './taunt.service';
import { CreateTauntDto } from './dto/create-taunt.dto';
import { UpdateTauntDto } from './dto/update-taunt.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(JWTAuthGuard)
@Controller('taunt')
export class TauntController {
  constructor(private readonly tauntService: TauntService) {}

  @Post()
  create(@Body() createTauntDto: CreateTauntDto, @Request() req) {
    const userId = req.user?.id
    return this.tauntService.create(createTauntDto, userId);
  }
  
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.tauntService.findAll();
  }

  @Get('mytaunts')
  findUserTaunt(@Request() req){
    const userId = req.user?.id
    return this.tauntService.findUserTaunt(userId)
  
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
    return this.tauntService.delete(+id);
  }
}
