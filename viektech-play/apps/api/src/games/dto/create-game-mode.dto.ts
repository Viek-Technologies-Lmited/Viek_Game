import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGameModeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}
