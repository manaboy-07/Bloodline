import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@UseGuards(JWTAuthGuard)
@Controller('match')

export class MatchController {
  constructor(private readonly matchService: MatchService) {}
  
  @Roles(Role.ADMIN)
  @Post('create')
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }
  
  @Roles(Role.ADMIN, Role.USER)
  @Get()
  findAll() {
    return this.matchService.findAll();
  }
  
  @Roles(Role.ADMIN, Role.USER)
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(+id);
  }
  
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
  return this.matchService.update(+id, updateMatchDto);
  }
  
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchService.deleteMatch(+id);
  }
}
