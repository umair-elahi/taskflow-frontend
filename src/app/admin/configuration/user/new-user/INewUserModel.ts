export interface INewUserModel {
    id: String;
    firstName: String;
    lastName: String;
    email: String;
    password: String;
    roleIds: Array<number>;
    contactNo: String;
    gender: String;
    timezone: String;
    pictureUrl: String;
}
