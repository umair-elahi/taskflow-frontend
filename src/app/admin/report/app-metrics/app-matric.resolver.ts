import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { SpinnerService } from '../../helper/services/spinner.service';
import { WorkflowService } from '../../workflow/workflow.service';

@Injectable()
export class AppMatricsResolver implements Resolve<any> {
    constructor(private workflowService: WorkflowService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const applications = await this.workflowService.getApplications('', '', []);
        return applications.data;
    }
}
