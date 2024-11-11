export interface IChangePasswordModel {
    oldPassword: String;
    newPassword: String;
}

export interface IMyProfileModel {
    contactNo: String;
    createdAt: Date;
    email: String;
    firstName: String;
    gender: String;
    id: String;
    isActive: boolean;
    lastName: String;
    pictureUrl: String;
    role: Array<String>;
    updatedAt: Date;
}
