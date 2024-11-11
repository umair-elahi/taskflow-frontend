import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
    MatStepperModule,
    MatIconModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressBarModule
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
// import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '../shared/shared.module';
import { WorkflowRoutingModule } from './workflow.routing.module';

// services
import { WorkflowService } from './workflow.service';

// component
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateWorkflowComponent } from './create-workflow/create-workflow.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { WorkflowExecutionComponent } from './workflow-execution/workflow-execution.component';
import { WorkflowExecutionListComponent } from './workflow-execution-list/workflow-execution-list.component';
import { AddNewListComponent } from '../configuration/list/add-new-list/add-new-list.component';
import { AllWorkflowModalComponent } from './dashboard/all-workflow-modal/all-workflow-modal.component';
import { DraftComponent } from './draft/draft.component';
import { ApprovedComponent } from './approved/approved.component';
import { RejectedComponent } from './rejected/rejected.component';
import { ClarificationComponent } from './clarification/clarification.component';
import { ExecutionListComponent } from './execution-task-list/execution-task-list.component';
import { InputRequestComponent } from './input-request/input-request.component';
import { ConfirmationCommentsModalComponent } from './confirmation-comments-modal/confirmation-comments-modal.component';
import { FormlyFieldFileInputComponent } from './formly-component/input-file';

// resolvers
import { DashboardResolver } from './dashboard/dashboard-resolver';
import { WorkflowResolver } from './create-workflow/workflow-resolver';
import { WorkflowExecutionResolver } from './workflow-execution/workflow-execution-resolver';
import { ConfigurationService } from '../configuration/configuration.service';
import { WorkflowListResolver } from './workflow-list/workflow-list-resolver';
import { environment } from 'src/environments/environment';
import { ReAssignComponent } from './re-assign/re-assign.component';
import { DeleteExecutionComponent } from './delete-execution/delete-execution.component';

@NgModule({
    imports: [
        WorkflowRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FormlyModule.forRoot({
            types: [
                { name: 'file', component: FormlyFieldFileInputComponent },
            ],
        }),
        FormlyBootstrapModule,
        CommonModule,
        NgSelectModule,
        SharedModule,
        MatStepperModule,
        MatIconModule,
        DragDropModule,
        MatExpansionModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatDialogModule,
        MatMenuModule,
        MatProgressBarModule,
        // AgmCoreModule.forRoot({
            // apiKey: environment.googleAPIKey
        // })
    ],
    declarations: [
        DashboardComponent,
        CreateWorkflowComponent,
        WorkflowExecutionComponent,
        WorkflowExecutionListComponent,
        AddNewListComponent,
        WorkflowListComponent,
        AllWorkflowModalComponent,
        DraftComponent,
        ApprovedComponent,
        RejectedComponent,
        ClarificationComponent,
        ExecutionListComponent,
        InputRequestComponent,
        ConfirmationCommentsModalComponent,
        FormlyFieldFileInputComponent,
        ReAssignComponent,
        DeleteExecutionComponent
    ],
    entryComponents: [
        AddNewListComponent,
        AllWorkflowModalComponent,
        ConfirmationCommentsModalComponent,
        ReAssignComponent
    ],
    providers: [
        ConfigurationService,
        WorkflowService,
        DashboardResolver,
        WorkflowResolver,
        WorkflowExecutionResolver,
        WorkflowListResolver
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkflowModule {

}
