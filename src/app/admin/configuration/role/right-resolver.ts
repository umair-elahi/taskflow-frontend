import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ConfigurationService } from '../configuration.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Injectable()
export class RightResolver implements Resolve<any> {
    constructor(private configurationService: ConfigurationService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const role: any = await this.configurationService.getRoles('1', '10', []);
        const right: any = []; // await this.configurationService.getRights('1', '10', '');
        const roles = role;
        const rights = right;
        return {
            roles,
            rights
        };
    }
}
