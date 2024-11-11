import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewUserResolver } from './user/new-user/new-user-resolver';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { NewUserComponent } from './user/new-user/new-user.component';
import { RightResolver } from './role/right-resolver';
import { UserResolver } from './user/user-resolver';
import { OfficeLocationComponent } from './office-location/office-location.component';
import { OfficeLocationResolver } from './office-location/office-location-resolver';
import { DepartmentComponent } from './department/department.component';
import { DepartmentResolver } from './department/department-resolver';
import { GroupsComponent } from './groups/groups.component';
import { GroupResolver } from './groups/group-resolver';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardResolver } from './dashboard/dashboard-resolver';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyProfileResolver } from './my-profile/my-profile-resolver';
import { ListComponent } from './list/list.component';
import { ListResolver } from './list/list-resolver';

const CONFIGURATION_ROUTE: Routes = [
    { path: '', redirectTo: 'dashboard' },
    { path: 'dashboard', component: DashboardComponent, resolve: { data: DashboardResolver } },
    { path: 'roles', component: RoleComponent, resolve: { data: RightResolver } },
    { path: 'users', component: UserComponent, resolve: { data: UserResolver } },
    { path: 'user/new', component: NewUserComponent, resolve: { data: NewUserResolver } },
    { path: 'user/:id', component: NewUserComponent, resolve: { data: NewUserResolver } },
    { path: 'office-location', component: OfficeLocationComponent, resolve: { data: OfficeLocationResolver } },
    { path: 'departments', component: DepartmentComponent, resolve: { data: DepartmentResolver } },
    { path: 'groups', component: GroupsComponent, resolve: { data: GroupResolver } },
    { path: 'my-profile', component: MyProfileComponent, resolve: { data: MyProfileResolver } },
    { path: 'lists', component: ListComponent, resolve: { data: ListResolver } }
];

@NgModule({
    imports: [RouterModule.forChild(CONFIGURATION_ROUTE)],
    exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
