import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardResolver } from './dashboard/dashboard-resolver';
import { CreateWorkflowComponent } from './create-workflow/create-workflow.component';
import { WorkflowResolver } from './create-workflow/workflow-resolver';
import { WorkflowExecutionComponent } from './workflow-execution/workflow-execution.component';
import { WorkflowExecutionResolver } from './workflow-execution/workflow-execution-resolver';
import { WorkflowExecutionListComponent } from './workflow-execution-list/workflow-execution-list.component';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { WorkflowListResolver } from './workflow-list/workflow-list-resolver';
import { ExecutionListComponent } from './execution-task-list/execution-task-list.component';
import { DeleteExecutionComponent } from './delete-execution/delete-execution.component';

const WORKFLOW_ROUTE: Routes = [
    { path: '', redirectTo: 'dashboard' },
    { path: 'dashboard', component: DashboardComponent, resolve: { data: DashboardResolver } },
    { path: 'create/:id', component: CreateWorkflowComponent, resolve: { data: WorkflowResolver } },
    { path: 'list', component: WorkflowListComponent, resolve: { data: WorkflowListResolver } },
    { path: ':appId/execute/:id/:state', component: WorkflowExecutionComponent, resolve: { data: WorkflowExecutionResolver } },
    { path: ':id/execute-list', component: WorkflowExecutionListComponent },
    { path: 'draft/:appId', component: ExecutionListComponent },
    { path: 'inprogress/:appId', component: ExecutionListComponent },
    { path: 'approved/:appId', component: ExecutionListComponent },
    { path: 'rejected/:appId', component: ExecutionListComponent },
    { path: 'clarification/:appId', component: ExecutionListComponent },
    { path: 'approvals/:appId', component: ExecutionListComponent },
    { path: 'input-request/:appId', component: ExecutionListComponent },
    { path: 'participated', component: ExecutionListComponent },
    { path: 'withdraw', component: ExecutionListComponent },
    { path: 'delete-executions', component: DeleteExecutionComponent },
];

@NgModule({
    imports: [RouterModule.forChild(WORKFLOW_ROUTE)],
    exports: [RouterModule]
})
export class WorkflowRoutingModule { }
