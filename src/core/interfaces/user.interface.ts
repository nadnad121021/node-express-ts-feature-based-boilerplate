import { IQuery } from "./common.interface";

export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IGetUsersFilterQuery extends IQuery {
    searchKey?: string;
}