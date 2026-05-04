import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException, ParseIntPipe, Query } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { UpdatePredictionDto } from './dto/update-prediction.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
@UseGuards(JWTAuthGuard)
@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post()
  create(@Request() req,@Body() createPredictionDto: CreatePredictionDto) {
    const userId = req.user?.id
    if (!userId) throw new UnauthorizedException('User ID missing');
    const {awayScore, homeScore,matchId} = createPredictionDto
    return this.predictionService.create( awayScore, homeScore,matchId, userId);
  }
  
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.predictionService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.predictionService.findOne(+id);
  }

  @Patch()
  update(@Request() req , @Body() updatePredictionDto: UpdatePredictionDto) {
   const {awayScore,homeScore,matchId} = updatePredictionDto
   const userId = req.user?.id
    return this.predictionService.update(awayScore!,homeScore!,matchId!,userId);
  }

  @Delete()
  remove(@Request() req , @Query('matchId', ParseIntPipe) matchId: number) {
    const userId = req.user?.id
    return this.predictionService.deletePrediction(userId, matchId);
  }

  @Get('mypredictions')
  getUserPrediction(@Request() req){
    const userId = req.user?.id
    return this.predictionService.getUserPrediction(userId)
  }
  
  @Roles(Role.ADMIN)
  @Get('match')
  getMatchPrediction(@Query('matchId', ParseIntPipe) matchId: number){
   return this.predictionService.getMatchPrediction(matchId)
  }

  
}
