import { IsKebabSlug } from '../../../common/validators/is-kebab-slug.decorator';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class ListProjectsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @IsKebabSlug()
  sector?: string;
}
