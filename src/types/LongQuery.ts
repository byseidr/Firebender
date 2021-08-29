import QueryParams from "../types/QueryParams";

type LongQuery = {
    collection: string;
    field: string;
    params: QueryParams[];
    data?: any;
};

export default LongQuery;
