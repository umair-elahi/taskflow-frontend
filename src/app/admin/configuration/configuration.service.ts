import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISaveRoleModel } from './role/IRoleModel';
import { ISaveOfficeLocationModel } from './office-location/IOfficeLocationModel';
import { ISaveDepartmentModel } from './department/IDepartmentModel';
import { ISaveGroupModel } from './groups/IGroupModel';
import { INewUserModel } from './user/new-user/INewUserModel';
import { IChangePasswordModel } from './my-profile/IMyProfileModel';
import { ISaveListModel, ISaveListDataModel } from './list/IListModel';

@Injectable()
export class ConfigurationService {

    constructor(private http: HttpClient) { }

    // Dashboard
    getDashboardStats(): Promise<any> {
        return this.http.get(`dashboard/admin/statistics`).toPromise();
    }

    // role
    getRoles(pageNo: string, noOfRecords: string, searchText: any[]): Promise<any> {
        return this.http.get(`role`).toPromise();
    }

    getAllRoles(): Promise<any> {
        return this.http.get(`role`).toPromise();
    }

    getRoleById(id: string): Promise<any> {
        return this.http.get(`role`, { params: { Id: id } }).toPromise();
    }

    saveRole(body: ISaveRoleModel): Promise<any> {
        return this.http.post(`role`, body).toPromise();
    }

    deleteRole(Id: string): Promise<any> {
        return this.http.delete(`role/` + Id).toPromise();
    }

    // user
    getallUsers(): Promise<any> {
        return this.http.get(`user`).toPromise();
    }

    getUsers(pageNo: string, noOfRecords: string, searchText: any[]): Promise<any> {
        return this.http.get(`user`).toPromise();
    }

    getUserById(id: string): Promise<any> {
        return this.http.get(`user/` + id).toPromise();
    }

    getUserByDepartmentId(id: number): Promise<any> {
        return this.http.get(`user/department/` + id).toPromise();
    }

    saveUser(body: INewUserModel): Promise<any> {
        if (!body.id) {
            delete body.id;
        }
        return this.http.post(`user`, body).toPromise();
    }

    updateUser(body: any = {}): Promise<any> {
        return this.http.post(`user/` + body.id, body).toPromise();
    }

    deleteUser(Id: string): Promise<any> {
        return this.http.delete(`user/${Id}/delete`).toPromise();
    }

    ChangePassword(body: IChangePasswordModel) {
        return this.http.put(`user/change-password`, body).toPromise();
    }

    SaveImage(fileToUpload: File): Promise<any> {
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        return this.http.post(`file/picture`, formData).toPromise();
    }

    // right
    getRights(pageNo: string, noOfRecords: string, searchText: string) {
        return this.http.get(`right`).toPromise();
    }

    // Office Location
    getOfficeLocations(pageNo: string, noOfRecords: string, searchText: any[]): Promise<any> {
        return this.http.get(`office-location`).toPromise();
    }

    saveOfficeLocation(body: ISaveOfficeLocationModel): Promise<any> {
        return this.http.post(`office-location`, body).toPromise();
    }

    deleteOfficeLocation(Id: string): Promise<any> {
        return this.http.delete(`office-location/` + Id).toPromise();
    }

    // department
    getDepartments(pageNo: string, noOfRecords: string, searchText: any[]): Promise<any> {
        return this.http.get(`department`).toPromise();
    }

    saveDepartment(body: ISaveDepartmentModel): Promise<any> {
        return this.http.post(`department`, body).toPromise();
    }

    deleteDepartment(Id: string): Promise<any> {
        return this.http.delete(`department/` + Id).toPromise();
    }

    // group
    getGroups(pageNo: string, noOfRecords: string, searchText: any[]): Promise<any> {
        return this.http.get(`group`).toPromise();
    }

    saveGroup(body: ISaveGroupModel): Promise<any> {
        return this.http.post(`group`, body).toPromise();
    }

    deleteGroup(Id: string): Promise<any> {
        return this.http.delete(`group/` + Id).toPromise();
    }

    // Lists
    getAllLists(pageNo: string, noOfRecords: string, searchText: any[]): Promise<any> {
        return this.http.get(`lookup`).toPromise();
    }

    getAllListDataById(id: string): Promise<any> {
        return this.http.get(`lookup/${id}/data`).toPromise();
    }

    getLookupDataById(id: number): Promise<any> {
        return this.http.get(`lookup/lookup-data/${id}`).toPromise();
    }

    saveList(body: ISaveListModel): Promise<any> {
        return this.http.post(`lookup`, body).toPromise();
    }

    saveListData(body: ISaveListDataModel, id: string): Promise<any> {
        return this.http.post(`lookup/${id}/data`, body).toPromise();
    }

    deleteList(Id: string): Promise<any> {
        return this.http.delete(`lookup/` + Id).toPromise();
    }

    deleteListData(Id: string, lookupId): Promise<any> {
        return this.http.delete(`lookup/${lookupId}/data/${Id}`).toPromise();
    }

}
