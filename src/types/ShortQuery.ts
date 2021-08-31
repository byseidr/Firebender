import QueryParams from "../types/QueryParams";

type ShortQuery = {
    collection: string;
    field: string;
    params?: QueryParams[];
    data?: any;
};

export default ShortQuery;
