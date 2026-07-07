import { IsString, IsNotEmpty, IsInt, Min, Max } from "class-validator";

export class CreateGameModeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsInt()
  @Min(5)
  @Max(120)
  timePerQuestionSeconds: number;
}
