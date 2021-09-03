import { firestore } from "firebase-admin";

export type LongQuery = {
    collection: string;
    field: string;
    params: QueryParams[];
    data?: any;
};

export type Query = {
    collection: string;
    params: QueryParams[];
    data?: any;
};

export type QueryParams = [
    string | firestore.FieldPath,
    FirebaseFirestore.WhereFilterOp,
    any
];

export type ShortQuery = {
    collection: string;
    field: string;
    params?: QueryParams[];
    data?: any;
};
