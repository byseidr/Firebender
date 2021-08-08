import QueryParams from "../types/QueryParams";

export default class Query {
    constructor(readonly collection: string, readonly params: QueryParams[]) {}
}
