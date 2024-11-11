import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SpinnerService } from '../../helper/services/spinner.service';
import { ConfigurationService } from '../../configuration/configuration.service';

@Injectable()
export class UserLocationResolver implements Resolve<any> {
    constructor(private configurationService: ConfigurationService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const users = await this.configurationService.getUsers('', '', []);
        return users.data;
    }
}
