import admin, { firestore, ServiceAccount } from "firebase-admin";

import LongQuery from "./classes/LongQuery";
import Query from "./classes/Query";
import QueryParams from "./types/QueryParams";

var db: firestore.Firestore;

exports.init = (serviceAccount: ServiceAccount) => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
};

exports.fieldValue = admin.firestore.FieldValue;

exports.getDoc = async (query: Query) => await exports.getFirstDoc(query);

exports.getDocs = async (query: Query) => {
    const result: any = [];
    if (!Object.keys(query).length) return result;
    const snapshot = await exports.getSnapshot(query);
    if (snapshot.empty) return result;
    for (let doc of snapshot.docs) {
        if (doc.exists) result.push(doc.data());
    }
    return result;
};

exports.getField = async (longQuery: LongQuery) => {
    const result = [];
    const snapshot = await exports.getSnapshot(longQuery);
    if (snapshot.empty) return null;
    for (let doc of snapshot.docs) {
        const field = doc.get(longQuery.field);
        if (!field) return null;
        result.push(field);
    }
    return result;
};

exports.getFirstDoc = async (query: Query) => {
    if (!Object.keys(query).length) return null;
    const docs = await exports.getDocs(query);
    return docs.length ? docs[0] : null;
};

exports.getSnapshot = async (
    query: Query | LongQuery,
    queryData: any = null
) => {
    if (!Object.keys(query).length) return null;
    let collectionRef: firestore.CollectionReference | firestore.Query =
        db.collection(query.collection);
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
