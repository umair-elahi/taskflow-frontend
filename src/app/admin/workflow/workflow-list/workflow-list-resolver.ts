import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { WorkflowService } from '../workflow.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Injectable()
export class WorkflowListResolver implements Resolve<any> {
    constructor(private workflowService: WorkflowService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const resDashboard: any = await this.workflowService.getApplications('', '', []);
        const data = resDashboard.data;
        return {
            data
        };
    }
}
