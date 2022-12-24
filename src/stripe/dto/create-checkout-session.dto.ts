import { IsString } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsString()
  readonly priceId: string;
}
