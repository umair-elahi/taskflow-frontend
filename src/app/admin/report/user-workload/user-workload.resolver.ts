import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ReportService } from '../report.service';
import { ConfigurationService } from './../../configuration/configuration.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Injectable()
export class UserWorkloadResolver implements Resolve<any> {
    constructor(private reportService: ReportService,
        private configurationService: ConfigurationService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const users = await this.configurationService.getallUsers();
        return users.data;
    }
}
