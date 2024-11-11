import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../helper/services/title.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as App from '../../../../assets/js/theme-fun';
import { WorkflowService } from '../workflow.service';
import { SwalService } from '../../helper/services/swal.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { MatDialog } from '@angular/material';
import { AllWorkflowModalComponent } from './all-workflow-modal/all-workflow-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  applications: any;
  limitedApps: any;
  constructor(private titleService: TitleService, private toastr: ToasterService, private _ActivatedRoute: ActivatedRoute,
    private workflowService: WorkflowService, private swalService: SwalService, private spinner: SpinnerService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.titleService.setTitle('Workflow', 'Dashboard');
    const data = this._ActivatedRoute.snapshot.data['data'].data;
    this.applications = _.filter(data, { isPublished: true });
    this.limitedApps = _.take(this.applications, 2);
    this.spinner.hide();
    setTimeout(() => {
      App.initMatchHeight();
    }, 100);
  }

  async getApplications() {
    try {
      this.spinner.showFull();
      const res = await this.workflowService.getApplications('1', '10', []);
      if (res && res.data) {
        this.applications = _.filter(res.data, { isPublished: true });
        this.limitedApps = _.take(this.applications, 2);
        setTimeout(() => {
          App.initMatchHeight();
        }, 100);
      }
    } catch (ex) {

    } finally {
      this.spinner.hide();
    }
  }

  showAllApps() {
    const dialogRef = this.dialog.open(AllWorkflowModalComponent, {
      width: '700px',
      data: this.applications
    });
  }
}
