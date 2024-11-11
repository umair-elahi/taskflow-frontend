import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserService } from '../../helper/services/user.service';
import { ConfigurationService } from '../configuration.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Injectable()
export class MyProfileResolver implements Resolve<any> {
    constructor(private userService: UserService, private configurationService: ConfigurationService,
        private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const resUser: any = await this.configurationService.getUserById(this.userService.getUser().id);
        const resRoles: any = await this.configurationService.getAllRoles();
        const user = resUser.data;
        const roles = resRoles.data;
        return {
            user,
            roles
        };
    }
}
