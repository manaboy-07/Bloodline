import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prediction } from 'src/generated/prisma/client';
import { PredictionModel } from './predictionmodel';

@ObjectType()
export class MatchModel {
  @Field()
  id: number;

  @Field()
  homeTeam: string;

  @Field()
  awayTeam: string;

  @Field((type) => Int, { nullable: true })
  homeScore?: number;

  @Field((type) => Int, { nullable: true })
  awayScore?: number;
  @Field(() => [PredictionModel], { nullable: true })
  predictions?: PredictionModel[];
}
