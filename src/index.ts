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
    if (!Object.keys(query).length) return result;
    const snapshot = await getSnapshot(query);
    if (!snapshot || snapshot.empty) return result;
    for (let doc of snapshot.docs) {
        if (doc.exists) result.push(doc.data());
    }
    return result;
};

export const getField = async (longQuery: LongQuery): Promise<any> => {
    const result: any[] = [];
    const snapshot = await getSnapshot(longQuery);
    if (!snapshot || snapshot.empty) return null;
    for (let doc of snapshot.docs) {
        const field = doc.get(longQuery.field);
        if (!field) return null;
        result.push(field);
    }
    return result;
};

export const getFirstDoc = async (query: Query): Promise<any> => {
    if (!Object.keys(query).length) return null;
    const docs: any[] = await getDocs(query);
    return docs.length ? docs[0] : null;
};

export const getSnapshot = async (
    query: Query | LongQuery,
    queryData: any = null
): Promise<firestore.QuerySnapshot | null> => {
    if (!Object.keys(query).length) return null;
    let collectionRef: firestore.CollectionReference | firestore.Query =
        getCollectionRef(query.collection);
    query.params.forEach((param: QueryParams) => {
        const [path, op, value] = param;
        collectionRef = collectionRef.where(
            path,
            op,
            typeof value === "function" ? value(queryData) : value
        );
    });
    return await collectionRef.get();
};
