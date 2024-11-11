import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ConfigurationService } from '../configuration.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Injectable()
export class DepartmentResolver implements Resolve<any> {
    constructor(private configurationService: ConfigurationService,
        private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const resUsers: any = await this.configurationService.getallUsers();
        const resDepartments: any = await this.configurationService.getDepartments('1', '10', []);
        const users = resUsers.data;
        const departments = resDepartments.data;
        return {
            users,
            departments
        };
    }
}
