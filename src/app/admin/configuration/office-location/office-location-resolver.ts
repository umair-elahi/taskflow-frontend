import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ConfigurationService } from '../configuration.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Injectable()
export class OfficeLocationResolver implements Resolve<any> {
    constructor(private configurationService: ConfigurationService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const resUsers: any = await this.configurationService.getallUsers();
        const resOfficeLocations: any = await this.configurationService.getOfficeLocations('1', '10', []);
        const users = resUsers.data;
        const officeLocations = resOfficeLocations.data;
        return {
            users,
            officeLocations
        };
    }
}
