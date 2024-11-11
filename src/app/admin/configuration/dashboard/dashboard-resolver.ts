import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ConfigurationService } from '../configuration.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Injectable()
export class DashboardResolver implements Resolve<any> {
    constructor(private configurationService: ConfigurationService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        let data = [];
        try {
            const resDashboard: any = await this.configurationService.getDashboardStats();
            data = resDashboard.data;
            return {
                data
            };
        } catch (ex) {
            return {
                data
            };
        }
    }
}
