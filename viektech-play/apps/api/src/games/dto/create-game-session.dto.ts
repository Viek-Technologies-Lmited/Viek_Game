import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateGameSessionDto {
  @IsString()
  gameModeId: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(100)
  maxParticipants?: number;
}
