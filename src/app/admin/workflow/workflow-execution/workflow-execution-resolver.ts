import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ConfigurationService } from '../../configuration/configuration.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Injectable()
export class WorkflowExecutionResolver implements Resolve<any> {
    constructor(private configurationService: ConfigurationService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const resList: any = await this.configurationService.getAllLists('1', '10', []);
        const lists = resList.data;
        return {
            lists
        };
    }
}
