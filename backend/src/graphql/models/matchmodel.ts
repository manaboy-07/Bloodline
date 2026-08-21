import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PredictionModel } from './predictionmodel';

@ObjectType()
export class MatchModel {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  homeTeam!: string;

  @Field(() => String)
  awayTeam!: string;

  @Field(() => Int, { nullable: true })
  homeScore?: number;

  @Field(() => Int, { nullable: true })
  awayScore?: number;

  @Field(() => [PredictionModel], { nullable: true })
  predictions?: PredictionModel[];
}
