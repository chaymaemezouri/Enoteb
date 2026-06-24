import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { IsImageUrl } from '../../../common/validators/is-image-url.decorator';

export class AddProjectPhotoDto {
  @IsImageUrl()
  url!: string;

  @IsString()
  @IsNotEmpty()
  altText!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  order!: number;
}
