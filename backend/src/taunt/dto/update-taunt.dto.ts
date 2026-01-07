import { PartialType } from '@nestjs/mapped-types';
import { CreateTauntDto } from './create-taunt.dto';

export class UpdateTauntDto extends PartialType(CreateTauntDto) {}
