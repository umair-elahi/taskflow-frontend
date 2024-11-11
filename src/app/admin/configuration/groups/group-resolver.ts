import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ConfigurationService } from '../configuration.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Injectable()
export class GroupResolver implements Resolve<any> {
    constructor(private configurationService: ConfigurationService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const resUsers: any = await this.configurationService.getallUsers();
        const resGroups: any = await this.configurationService.getGroups('1', '10', []);
        const users = resUsers.data;
        const groups = resGroups.data;
        return {
            users,
            groups
        };
    }
}
