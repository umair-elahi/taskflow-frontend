import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ConfigurationService } from './../../configuration.service';
import { SpinnerService } from 'src/app/admin/helper/services/spinner.service';

@Injectable()
export class NewUserResolver implements Resolve<any> {
    constructor(private configurationService: ConfigurationService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const role: any = await this.configurationService.getAllRoles();
        const dept: any = await this.configurationService.getDepartments('', '', []);
        const ofcLocation: any = await this.configurationService.getOfficeLocations('', '', []);
        const user: any = await this.configurationService.getallUsers();
        const roles = role.data;
        const departments = dept.data;
        const officeLocations = ofcLocation.data;
        const users = user.data;
        return {
            roles,
            departments,
            officeLocations,
            users
        };
    }
}
