export interface IDepartmentModel {
    id?: number;
    name?: string;
    isActive: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISaveDepartmentModel {
    id?: number;
    name?: string;
    userId: string;
}
