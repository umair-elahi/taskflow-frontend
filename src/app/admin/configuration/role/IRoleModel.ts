export interface IRoleModel {
    id?: number;
    name?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISaveRoleModel {
    id?: number;
    name?: string;
    rightsIds: Array<string>;
}
