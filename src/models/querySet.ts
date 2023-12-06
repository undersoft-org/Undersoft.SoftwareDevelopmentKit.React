import { Model } from "./model";

export interface QuerySet extends Model {

    FilterItems?: FilterItem[];
    SortItems?: SortItem[];
    
}

export interface FilterItem extends Model {
    Property?: string
    Operand?: string 
    Data?: string
    Value?: string
    Type?: string
    Logic?: string
}

export interface SortItem extends Model {

    Direction?: string;
    Property?: string;
}