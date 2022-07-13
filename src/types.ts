import { firestore } from "firebase-admin";

export interface LongQuery {
    collection: string;
    field: string;
    params: QueryParams[];
    data?: any;
    order?: QueryOrder;
    limit?: number;
}

export interface Query {
    collection: string;
    params: QueryParams[];
    data?: any;
    order?: QueryOrder;
    limit?: number;
}

export interface ShortQuery {
    collection: string;
    field: string;
    params?: QueryParams[];
    data?: any;
    order?: QueryOrder;
    limit?: number;
}

export type QueryOrder = [
    string | firestore.FieldPath,
    FirebaseFirestore.OrderByDirection | undefined
];

export type QueryParams = [
    string | firestore.FieldPath,
    FirebaseFirestore.WhereFilterOp,
    any
];
