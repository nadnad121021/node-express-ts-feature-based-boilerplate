import { TSortOrder } from "@core/enums/common.enum";
export interface IQuery {
    skip?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: TSortOrder
}