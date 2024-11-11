// DashboardResolver
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { WorkflowService } from '../workflow.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Injectable()
export class DashboardResolver implements Resolve<any> {
    constructor(private workflowService: WorkflowService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        try {
            const resDashboard: any = await this.workflowService.getApplications('', '', []);
            const data = resDashboard.data;
            return {
                data
            };
        } finally {
            this.spinner.hide(); // Ensure that the spinner is hidden regardless of the outcome
        }
    }
}
