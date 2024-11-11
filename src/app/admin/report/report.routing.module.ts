import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyItemComponent } from './my-item/my-item.component';
import { MyItemResolver } from './my-item/my-item.resolver';

import { UserWorkloadComponent } from './user-workload/user-workload.component';
import { UserWorkloadResolver } from './user-workload/user-workload.resolver';
import { AppTimelineComponent } from './app-timeline/app-timeline.component';
import { AppTimelineResolver } from './app-timeline/app-timeline.resolver';
import { AppMetricsComponent } from './app-metrics/app-metrics.component';
import { AppMatricsResolver } from './app-metrics/app-matric.resolver';
import { MyItemDetailComponent } from './my-item-detail/my-item-detail.component';
import { AppLocationComponent } from './app-location/app-location.component';
import { AppLocationResolver } from './app-location/app-location.resolver';
import { UserLocationComponent } from './user-location/user-location.component';
import { UserLocationResolver } from './user-location/user-location.resolver';

const REPORT_ROUTE: Routes = [
    // { path: '', redirectTo: 'my-item' },
    { path: 'my-item', component: MyItemComponent, resolve: { data: MyItemResolver } },
    { path: 'user-summary', component: UserWorkloadComponent, resolve: { data: UserWorkloadResolver } },
    { path: 'app-timeline', component: AppTimelineComponent, resolve: { data: AppTimelineResolver } },
    { path: 'app-metrics', component: AppMetricsComponent, resolve: { data: AppMatricsResolver } },
    { path: 'my-item/draft/:appId', component: MyItemDetailComponent },
    { path: 'my-item/approved/:appId', component: MyItemDetailComponent },
    { path: 'my-item/rejected/:appId', component: MyItemDetailComponent },
    { path: 'my-item/clarification/:appId', component: MyItemDetailComponent },
    { path: 'my-item/approvals/:appId', component: MyItemDetailComponent },
    { path: 'my-item/input-request/:appId', component: MyItemDetailComponent },
    { path: 'my-item/withdraw/:appId', component: MyItemDetailComponent },
    { path: 'my-item/workload/:appId', component: MyItemDetailComponent },
    { path: 'app-location', component: AppLocationComponent, resolve: { data: AppLocationResolver } },
    { path: 'user-location', component: UserLocationComponent, resolve: { data: UserLocationResolver } },
];

@NgModule({
    imports: [RouterModule.forChild(REPORT_ROUTE)],
    exports: [RouterModule]
})
export class ReportRoutingModule { }