import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
export declare class ListProjectsQueryDto extends PaginationQueryDto {
    sector?: string;
    q?: string;
}
