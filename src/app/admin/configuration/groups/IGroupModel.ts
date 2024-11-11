export interface IGroupModel {
    id?: number;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    userIds: string[];
}

export interface ISaveGroupModel {
    id?: number;
    name: string;
    userIds: string[];
}
