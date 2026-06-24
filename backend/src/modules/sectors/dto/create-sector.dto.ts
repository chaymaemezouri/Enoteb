import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { IsImageUrl } from '../../../common/validators/is-image-url.decorator';
import { IsKebabSlug } from '../../../common/validators/is-kebab-slug.decorator';

export class CreateSectorDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsKebabSlug()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsImageUrl()
  imageUrl?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  order!: number;
}
