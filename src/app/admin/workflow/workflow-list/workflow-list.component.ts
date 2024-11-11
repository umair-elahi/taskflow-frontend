import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../helper/services/title.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import * as App from '../../../../assets/js/theme-fun';
import { WorkflowService } from '../workflow.service';
import { constants } from '../../helper/constants';
import { SwalService } from '../../helper/services/swal.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Component({
  selector: 'app-workflow-list',
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.scss']
})
export class WorkflowListComponent implements OnInit {

  applications: any;
  constructor(private titleService: TitleService, private toastr: ToasterService, private _ActivatedRoute: ActivatedRoute,
    private workflowService: WorkflowService, private swalService: SwalService, private spinner: SpinnerService) { }

  ngOnInit() {
    this.titleService.setTitle('Workflow', 'Apps');
    this.applications = this._ActivatedRoute.snapshot.data['data'].data;
    this.spinner.hide();
    setTimeout(() => {
      App.initMatchHeight();
    }, 100);
  }

  async deleteApplication(applicationId: string) {
    const { value: alertRes } = await this.swalService.deleteWarningPopup();
    if (alertRes) {
      try {
        this.spinner.showFull();
        const res: any = await this.workflowService.deleteApplication(applicationId);
        if (res && res.data) {
          this.toastr.success('success', constants.messages.APPLICATION_DELETE_SUCCESS);
          this.getApplications();
        }
      } catch (ex) {

      } finally {
        this.spinner.hide();
      }
    }
  }

  async getApplications() {
    try {
      this.spinner.showFull();
      const res = await this.workflowService.getApplications('1', '10', []);
      if (res && res.data) {
        this.applications = res.data;
        setTimeout(() => {
          App.initMatchHeight();
        }, 100);
      }
    } catch (ex) {

    } finally {
      this.spinner.hide();
    }
  }

}
