import Query from "./Query";
import QueryParams from "../types/QueryParams";

export default class LongQuery extends Query {
    constructor(
        readonly collection: string,
        readonly params: QueryParams[],
        readonly field: string
    ) {
        super(collection, params);
    }
}
