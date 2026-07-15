import { IsNumber, IsPositive } from 'class-validator';

export class InitializePaymentDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}
