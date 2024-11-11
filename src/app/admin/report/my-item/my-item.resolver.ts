import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ReportService } from '../report.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Injectable()
export class MyItemResolver implements Resolve<any> {
    constructor(private reportService: ReportService, private spinner: SpinnerService) { }

    async resolve() {
        this.spinner.showFull();
        const response: any = await this.reportService.getMyItemReport('1', '10', []);
        return response.data;
    }
}
