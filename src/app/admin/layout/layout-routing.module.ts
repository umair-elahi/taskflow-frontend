import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportModule } from '../report/report.module';
// Components
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../helper/services/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'admin',
                canActivate: [AuthGuard],
                loadChildren: '../configuration/configuration.module#ConfigurationModule'
            },
            {
                path: 'workflow',
                canActivate: [AuthGuard],
                loadChildren: '../workflow/workflow.module#WorkflowModule'
            },
            {
                path: 'report',
                canActivate: [AuthGuard],
                loadChildren: '../report/report.module#ReportModule'
            },
            
            {
                path: '**',
                redirectTo: 'error'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
