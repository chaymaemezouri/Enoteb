import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  PROJECT_YEAR_MAX,
  PROJECT_YEAR_MIN,
} from '../../../common/constants';
import { IsImageUrl } from '../../../common/validators/is-image-url.decorator';
import { IsKebabSlug } from '../../../common/validators/is-kebab-slug.decorator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsKebabSlug()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  sectorId!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsOptional()
  @IsString()
  client?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsBoolean()
  showAmount?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PROJECT_YEAR_MIN)
  @Max(PROJECT_YEAR_MAX)
  year?: number;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsImageUrl()
  mainImageUrl!: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
