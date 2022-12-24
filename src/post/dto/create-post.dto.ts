import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Text {
  @IsString()
  readonly text: string;
}

class Image {
  @IsNumber()
  readonly id: number;
}

class Block {
  @ValidateNested()
  @Type(() => Text)
  readonly text: Text;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  readonly image: Image;
}

export class CreatePostDto {
  @IsString()
  readonly title: string;

  @IsString({ each: true })
  readonly tags: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Block)
  readonly content: Block[];
}
