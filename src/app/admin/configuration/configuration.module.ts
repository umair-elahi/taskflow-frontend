import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { ConfigurationRoutingModule } from './configuration.routing.module';

// services
import { ConfigurationService } from './configuration.service';

// component
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { NewUserComponent } from './user/new-user/new-user.component';
import { OfficeLocationComponent } from './office-location/office-location.component';
import { DepartmentComponent } from './department/department.component';
import { GroupsComponent } from './groups/groups.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ListComponent } from './list/list.component';
import { ListDataComponent } from './list/list-data/list-data.component';

// resolvers
import { NewUserResolver } from './user/new-user/new-user-resolver';
import { RightResolver } from './role/right-resolver';
import { UserResolver } from './user/user-resolver';
import { OfficeLocationResolver } from './office-location/office-location-resolver';
import { DepartmentResolver } from './department/department-resolver';
import { GroupResolver } from './groups/group-resolver';
import { DashboardResolver } from './dashboard/dashboard-resolver';
import { MyProfileResolver } from './my-profile/my-profile-resolver';
import { ListResolver } from './list/list-resolver';

@NgModule({
    imports: [
        ConfigurationRoutingModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgSelectModule,
        SharedModule
    ],
    declarations: [
        RoleComponent,
        UserComponent,
        NewUserComponent,
        OfficeLocationComponent,
        DepartmentComponent,
        GroupsComponent,
        DashboardComponent,
        MyProfileComponent,
        ListComponent,
        ListDataComponent
    ],
    entryComponents: [
        ListDataComponent
    ],
    providers: [
        ConfigurationService,
        NewUserResolver,
        RightResolver,
        UserResolver,
        OfficeLocationResolver,
        DepartmentResolver,
        GroupResolver,
        DashboardResolver,
        MyProfileResolver,
        ListResolver
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfigurationModule {

}
