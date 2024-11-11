import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ConfigurationService } from '../configuration.service';
import { IListModel } from './IListModel';
import { SpinnerService } from '../../helper/services/spinner.service';


@Injectable()
export class ListResolver implements Resolve<any> {
    constructor(private configurationService: ConfigurationService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const resUsers: any = await this.configurationService.getAllLists('0', '0', []);
        const lists = resUsers.data as IListModel[];
        return {
            lists
        };
    }
}
