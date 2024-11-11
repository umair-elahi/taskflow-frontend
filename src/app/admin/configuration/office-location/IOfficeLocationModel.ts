export interface IOfficeLocationModel {
    id?: number;
    name?: string;
    isActive: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISaveOfficeLocationModel {
    id?: number;
    name?: string;
    userId: string;
}
