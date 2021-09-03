import { firestore } from "firebase-admin";

export interface LongQuery {
    collection: string;
    field: string;
    params: QueryParams[];
    data?: any;
}

export interface Query {
    collection: string;
    params: QueryParams[];
    data?: any;
}

export interface ShortQuery {
    collection: string;
    field: string;
    params?: QueryParams[];
    data?: any;
}

export type QueryParams = [
    string | firestore.FieldPath,
    FirebaseFirestore.WhereFilterOp,
    any
];
