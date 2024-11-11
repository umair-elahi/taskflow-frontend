import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ConfigurationService } from './../configuration.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Injectable()
export class UserResolver implements Resolve<any> {
    constructor(private configurationService: ConfigurationService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const userList: any = await this.configurationService.getUsers('1', '10', []);
        const users = userList.data;
        return {
            users
        };
    }
}
