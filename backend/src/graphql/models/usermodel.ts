import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PredictionModel } from "./predictionmodel";

@ObjectType()
export class UserModel {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field((type) => Int)
  points: number;

  @Field(() => [PredictionModel])
  predictions: PredictionModel[];

//    “When I fetch a user, I can also fetch all predictions made by that user”
}