import { Field, Int, ObjectType } from "@nestjs/graphql";
import { MatchModel } from "./matchmodel";

@ObjectType()
export class PredictionModel {
   @Field()
   id: number

   @Field((type) => Int)
   homeScore: number

   @Field((type) => Int)
   awayScore: number

   @Field((type) => Int)
   points: number
   
   @Field(() => MatchModel )  //prediction on matches
   match: MatchModel
   //“This prediction is for THIS specific match”
   //A prediction belongs to a match

}