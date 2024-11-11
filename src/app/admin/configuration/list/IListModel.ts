export interface ISaveListModel {
    id?: number;
    name?: string;
    type: string;
    isActive: string;
}

export interface ISaveListDataModel {
    id: number;
    lookupId: number;
    display: string;
    value: string;
}

export interface IListModel {
    id?: number;
    name?: string;
    type: string;
}
