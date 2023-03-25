import * as $$ from "richierich";
import admin, { firestore, ServiceAccount } from "firebase-admin";

import { LongQuery, Query, QueryParams, ShortQuery } from "./types";

var db: firestore.Firestore;

export const addDoc = async (query: Query, data: firestore.DocumentData) => {
    getCollectionRef(query.collection).add(data);
};

export function init(db: firestore.Firestore): firestore.Firestore;
export function init(serviceAccount: ServiceAccount): firestore.Firestore;
export function init(
    arg: firestore.Firestore | ServiceAccount
): firestore.Firestore {
    if (arg.constructor.name === "Firestore") db = <firestore.Firestore>arg;
    else {
        admin.initializeApp({
            credential: admin.credential.cert(<ServiceAccount>arg),
        });
        db = admin.firestore();
    }
    return db;
}

export const fieldValue = admin.firestore.FieldValue;

export const getCollectionRef = (path: string): firestore.CollectionReference =>
    db.collection(path);

export const getDoc = async (
    query: Query,
    incRef: boolean = false
): Promise<firestore.DocumentData | undefined> =>
    await getFirstDoc(query, incRef);

export const getDocs = async (
    query: Query,
    incRef: boolean = false
): Promise<firestore.DocumentData[]> => {
    const result: firestore.DocumentData[] = [];
    if (!query || !Object.keys(query).length) return result;
    const snapshot = await getSnapshot(query);
    if (!snapshot || snapshot.empty) return result;
    for (let doc of snapshot.docs) {
        if (doc.exists) {
            let data = incRef ? { ...doc.data(), ref: doc.ref } : doc.data();
            result.push(data);
        }
    }
    return result;
};

export const getDocsByField = async (
    query: ShortQuery,
    fieldVals: string[],
    incRef: boolean = false
): Promise<firestore.DocumentData[]> => {
    let result: firestore.DocumentData[] = [];
    if (
        !query ||
        !Object.keys(query).length ||
        !query?.field ||
        !fieldVals ||
        !fieldVals.length
    )
        return result;
    result = await getDocs(
        {
            collection: query.collection,
            params: [[query.field, "in", fieldVals], ...(query.params || [])],
        },
        incRef
    );
    return result;
};

export const getDocByRef = async (
    ref: firestore.DocumentReference,
    incRef: boolean = false
): Promise<firestore.DocumentData> => {
    let doc = await ref.get();
    return incRef ? { ...doc.data()!, ref } : doc.data()!;
};

export const getField = async (
    query: LongQuery
): Promise<any[] | undefined> => {
    const result: any[] = [];
    if (!query || !Object.keys(query).length) return result;
    const snapshot = await getSnapshot(query);
    if (!snapshot || snapshot.empty) return;
    for (let doc of snapshot.docs) {
        const field = doc.get(query.field);
        if (field) result.push(field);
    }
    return result;
};

export const getFieldByRef = async (
    ref: firestore.DocumentReference,
    field: string
): Promise<any> => (await getDocByRef(ref))[field];

export const getFirstDoc = async (
    query: Query,
    incRef: boolean = false
): Promise<firestore.DocumentData | undefined> => {
    if (!query || !Object.keys(query).length) return;
    const docs: firestore.DocumentData[] = await getDocs(query, incRef);
    if (!docs.length) return;
    return docs[0];
};

export const getFirstRef = async (
    query: Query,
    defaultVal: any = undefined
): Promise<firestore.DocumentReference | any> => {
    if (!query || !Object.keys(query).length) return defaultVal;
    const snapshot = await getSnapshot(query);
    if (!snapshot || snapshot.empty) return defaultVal;
    if (!snapshot.docs.length) return;
    return snapshot.docs[0].ref;
};

export const getRef = async (
    query: Query,
    defaultVal: any = undefined
): Promise<firestore.DocumentReference | any> =>
    await getFirstRef(query, defaultVal);

export const getRefs = async (
    query: Query,
    defaultVal: any = undefined
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
): Promise<firestore.QuerySnapshot | undefined> => {
    if (!query || !Object.keys(query).length) return;
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
    if (query.order) collectionRef = collectionRef.orderBy(...query.order);
    if (query.limit) collectionRef = collectionRef.limit(query.limit);
    return await collectionRef.get();
};

export const hasDoc = async (query: Query): Promise<boolean> => {
    if (!query || !Object.keys(query).length) return false;
    const snapshot = await getSnapshot(query);
    return !!snapshot && !snapshot.empty;
};

export const hasDocs = async (queries: Query[]): Promise<boolean> => {
    let result: boolean[] = [];
    if (!queries || !queries.length) return false;
    for (let query of queries) {
        const docResult = await hasDoc(query);
        result.push(docResult);
    }
    return !!result.length && !result.includes(false);
};

export const hasField = async (query: LongQuery): Promise<boolean> => {
    if (!query || !Object.keys(query).length) return false;
    const field = await getField(query);
    return !!field?.length;
};

export const removeDoc = async (query: Query) => {
    const snapshot = await getSnapshot(query);
    if (snapshot && !snapshot.empty) {
        snapshot.forEach((doc: firestore.QueryDocumentSnapshot) => {
            doc.ref.parent.doc(doc.id).delete();
        });
    }
};

export const removeDocByRef = async (ref: firestore.DocumentReference) =>
    await ref.delete();

export const removeObjFromArray = async (
    query: LongQuery,
    objParams: QueryParams[]
) => {
    if (!query || !Object.keys(query).length || !objParams?.length)
        return false;
    const docs = await getDocs(query, true);
    for (const doc of docs) {
        let field = doc[query.field];
        if ($$.isObjArr(field)) {
            field = field.filter((obj: { [key: string]: any }) => {
                const paramResults = objParams.map((param) =>
                    $$.isOp(obj[<string>param[0]], param[2], param[1])
                );
                return paramResults.includes(false);
            });
            await setDocByRef(doc.ref, { [query.field]: field });
        }
    }
};

export const setDoc = async (
    query: Query,
    data: firestore.DocumentData,
    merge: boolean = true
) => {
    const snapshot = await getSnapshot(query);
    if (!snapshot || snapshot.empty) {
        getCollectionRef(query.collection).add(data);
    } else {
        snapshot.forEach((doc: firestore.QueryDocumentSnapshot) => {
            doc.ref.parent.doc(doc.id).set(data, { merge });
        });
    }
};

export const setDocByRef = async (
    ref: firestore.DocumentReference,
    data: firestore.DocumentData,
    merge: boolean = true
) => ref.parent.doc(ref.id).set(data, { merge });

export const updateDoc = async (query: Query, data: firestore.DocumentData) => {
    const snapshot = await getSnapshot(query);
    if (snapshot && !snapshot.empty) {
        snapshot.forEach((doc: firestore.QueryDocumentSnapshot) => {
            doc.ref.parent.doc(doc.id).update(data);
        });
    }
};
