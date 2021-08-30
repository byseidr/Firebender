import admin, { firestore, ServiceAccount } from "firebase-admin";

import LongQuery from "./types/LongQuery";
import Query from "./types/Query";
import QueryParams from "./types/QueryParams";

var db: firestore.Firestore;

export const init = (serviceAccount: ServiceAccount) => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
};

export const fieldValue = admin.firestore.FieldValue;

export const getCollectionRef = (name: string): firestore.CollectionReference =>
    db.collection(name);

export const getDoc = async (query: Query): Promise<any> =>
    await getFirstDoc(query);

export const getDocs = async (query: Query): Promise<any[]> => {
    const result: any[] = [];
    if (!query || !Object.keys(query).length) return result;
    const snapshot = await getSnapshot(query);
    if (!snapshot || snapshot.empty) return result;
    for (let doc of snapshot.docs) {
        if (doc.exists) result.push(doc.data());
    }
    return result;
};

export const getField = async (query: LongQuery): Promise<any> => {
    const result: any[] = [];
    if (!query || !Object.keys(query).length) return result;
    const snapshot = await getSnapshot(query);
    if (!snapshot || snapshot.empty) return null;
    for (let doc of snapshot.docs) {
        const field = doc.get(query.field);
        if (!field) return null;
        result.push(field);
    }
    return result;
};

export const getFirstDoc = async (query: Query): Promise<any> => {
    if (!query || !Object.keys(query).length) return null;
    const docs: any[] = await getDocs(query);
    return docs.length ? docs[0] : null;
};

export const getFirstRef = async (
    query: Query,
    defaultVal: any = null
): Promise<firestore.DocumentReference | any> => {
    if (!query || !Object.keys(query).length) return defaultVal;
    const snapshot = await getSnapshot(query);
    if (!snapshot || snapshot.empty) return defaultVal;
    return snapshot.docs.length ? snapshot.docs[0].ref : null;
};

export const getRef = async (
    query: Query,
    defaultVal: any = null
): Promise<firestore.DocumentReference | any> =>
    await getFirstRef(query, defaultVal);

export const getRefs = async (
    query: Query,
    defaultVal: any = null
): Promise<firestore.DocumentReference[] | any> => {
    const result: firestore.DocumentReference[] = [];
    if (!query || !Object.keys(query).length) return defaultVal;
    const snapshot = await getSnapshot(query);
    if (!snapshot || snapshot.empty) return defaultVal;
    for (let doc of snapshot.docs) {
        if (doc.exists) result.push(doc.ref);
    }
    return result;
};

export const getSnapshot = async (
    query: Query | LongQuery
): Promise<firestore.QuerySnapshot | null> => {
    if (!query || !Object.keys(query).length) return null;
    let collectionRef: firestore.CollectionReference | firestore.Query =
        getCollectionRef(query.collection);
    query.params.forEach((param: QueryParams) => {
        const [path, op, value] = param;
        collectionRef = collectionRef.where(
            path,
            op,
            typeof value === "function" ? value(query.data) : value
        );
    });
    return await collectionRef.get();
};
