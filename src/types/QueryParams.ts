import { firestore } from "firebase-admin";

type QueryParams = [
    string | firestore.FieldPath,
    FirebaseFirestore.WhereFilterOp,
    any
];

export default QueryParams;
