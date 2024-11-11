import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatAccordion, MatExpansionModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { ReportRoutingModule } from './report.routing.module';
import { ChartModule } from 'angular-highcharts';
// services
import { ConfigurationService } from './../configuration/configuration.service';
import { ReportService } from './report.service';
import { WorkflowService } from '../workflow/workflow.service';

// component
import { MyItemComponent } from './my-item/my-item.component';
import { UserWorkloadComponent } from './user-workload/user-workload.component';
import { AppTimelineComponent } from './app-timeline/app-timeline.component';
import { AppMetricsComponent } from './app-metrics/app-metrics.component';


// resolvers
import { MyItemResolver } from './my-item/my-item.resolver';
import { UserWorkloadResolver } from './user-workload/user-workload.resolver';
import { AppTimelineResolver } from './app-timeline/app-timeline.resolver';
import { AppMatricsResolver } from './app-metrics/app-matric.resolver';
import { MyItemDetailComponent } from './my-item-detail/my-item-detail.component';
import { AppLocationComponent } from './app-location/app-location.component';
import { AppLocationResolver } from './app-location/app-location.resolver';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { LocationMapModalComponent } from './location-map-modal/location-map-modal.component';
import { UserLocationComponent } from './user-location/user-location.component';
import { UserLocationResolver } from './user-location/user-location.resolver';
import { ReAssignComponent } from '../workflow/re-assign/re-assign.component';
import { WorkflowModule } from '../workflow/workflow.module';

@NgModule({
    imports: [
        ReportRoutingModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        NgSelectModule,
        SharedModule,
        ChartModule,
        MatExpansionModule,
        // AgmCoreModule.forRoot({
        //     apiKey: environment.googleAPIKey
        // }),
        WorkflowModule
    ],
    declarations: [
        MyItemComponent,
        UserWorkloadComponent,
        AppTimelineComponent,
        AppMetricsComponent,
        MyItemDetailComponent,
        AppLocationComponent,
        LocationMapModalComponent,
        UserLocationComponent
    ],
    entryComponents: [
        MyItemComponent,
        UserWorkloadComponent,
        AppTimelineComponent,
        AppMetricsComponent,
        AppLocationComponent,
        LocationMapModalComponent,
        UserLocationComponent
    ],
    providers: [
        WorkflowService,
        ConfigurationService,
        ReportService,
        MyItemResolver,
        UserWorkloadResolver,
        AppTimelineResolver,
        AppMatricsResolver,
        AppLocationResolver,
        UserLocationResolver
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportModule {

}
