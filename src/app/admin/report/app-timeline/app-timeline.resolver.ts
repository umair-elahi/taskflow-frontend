import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { SpinnerService } from '../../helper/services/spinner.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { ConfigurationService } from '../../configuration/configuration.service';

@Injectable()
export class AppTimelineResolver implements Resolve<any> {
    constructor(private workflowService: WorkflowService,
        private spinner: SpinnerService, private configurationService: ConfigurationService) { }

    async resolve() {
        this.spinner.showFull();
        const applications = await this.workflowService.getApplications('', '', []);
        const users = await this.configurationService.getUsers('', '', []);
        return {
            applications: applications.data,
            users: users
        };
    }
}
