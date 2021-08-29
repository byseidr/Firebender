import QueryParams from "../types/QueryParams";

type Query = {
    collection: string;
    params: QueryParams[];
    data?: any;
};

export default Query;
