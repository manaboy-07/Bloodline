import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { UpdatePredictionDto } from './dto/update-prediction.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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

  @Get()
  findAll() {
    return this.predictionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.predictionService.findOne(+id);
  }

  @Patch(':id')
  update(@Request() req ,@Param('id') id: string, @Body() updatePredictionDto: UpdatePredictionDto) {
   const {awayScore,homeScore,matchId} = updatePredictionDto
   const userId = req.user?.id
    return this.predictionService.update(+id, awayScore!,homeScore!,matchId!,userId);
  }

  @Delete(':id')
  remove(@Request() req ,@Param('id') id: string, @Body() matchId: number) {
    const userId = req.user?.id
    return this.predictionService.deletePrediction(+id, userId, matchId);
  }

  @Get()
  getUserPrediction(@Request() req){
    const userId = req.user?.id
    return this.predictionService.getUserPrediction(userId)
  }

  @Get()
  getMatchPrediction(@Body() matchId: number){
   return this.predictionService.getMatchPrediction(matchId)
  }

  
}
