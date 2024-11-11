    import { Injectable } from '@angular/core';
    import { Resolve } from '@angular/router';

    import { ConfigurationService } from '../../configuration/configuration.service';
    import { SpinnerService } from '../../helper/services/spinner.service';

    @Injectable()
    export class WorkflowResolver implements Resolve<any> {
        constructor(private configurationService: ConfigurationService, private spinner: SpinnerService) { }

        async resolve() {
            this.spinner.showFull();
            const resList: any = await this.configurationService.getAllLists('1', '10', []);
            const resUsers: any = await this.configurationService.getallUsers();
            const resDepartments: any = await this.configurationService.getDepartments('1', '10', []);
            const resGroup: any = await this.configurationService.getGroups('1', '10', []);
            const lists = resList.data;
            console.log('Lists data:', resList.data);
            console.log('Data type of lists:', Array.isArray(resList.data));
            console.log('Lists data:', resList.data);
            const users = resUsers.data;
            const groups = resGroup.data;
            const departments = resDepartments.data;
            return {
                lists,
                users,
                departments,
                groups
            };
        }
    }
