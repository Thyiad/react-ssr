export interface TableItem {
    name: string;
    phone: string;
    age: string;
    birthday: string;
    description: string;
    avatar: string;
}

export interface TableListParams {
    name?: string;
    phone?: string;
    age?: string;
    pageSize?: number;
    current?: number;
}
