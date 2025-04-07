import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../helper/services/title.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as App from '../../../../assets/js/theme-fun';
import { SwalService } from '../../helper/services/swal.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { MatDialog } from '@angular/material';
import { AllWorkflowModalComponent } from './all-workflow-modal/all-workflow-modal.component';
import { WorkflowService } from '../workflow.service';
import { ApplicationWorkflowType } from '../../helper/enum';
import { constants } from '../../helper/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  applications: any;
  limitedApps: any;
  appId: string = null;
  approvalPromise: any;
  approvalPromiseDataCount: any;
  inputPromise: any;
  inputPromiseDataCount: any;
  clarityPromise: any;
  clarityPromiseDataCount: any;


  constructor(private titleService: TitleService, private toastr: ToasterService, private _ActivatedRoute: ActivatedRoute,
    private workflowService: WorkflowService, private swalService: SwalService, private spinner: SpinnerService,
    private dialog: MatDialog) { }

  async ngOnInit() {

    const paramId = this._ActivatedRoute.snapshot.paramMap.get('appId');
    this.appId = paramId === 'all' ? null : paramId;


    this.approvalPromise = await this.workflowService.getAllMyExecutions(constants.executionStatus.DRAFT, ApplicationWorkflowType.APPROVAL, this.appId);
    this.approvalPromiseDataCount = this.approvalPromise.data.length;
    
    this.inputPromise = await this.workflowService.getAllMyExecutions(constants.executionStatus.DRAFT, ApplicationWorkflowType.INPUT, this.appId);
    this.inputPromiseDataCount = this.inputPromise.data.length;
    
    this.clarityPromise = await this.workflowService.getAllMyExecutions(constants.executionStatus.CLARITY, null, this.appId);
    this.clarityPromiseDataCount = this.clarityPromise.data.length;
    
    console.log('approvalPromiseDataCount', this.approvalPromiseDataCount);
    console.log('inputPromiseDataCount', this.inputPromiseDataCount);
    console.log('clarityPromiseDataCount', this.clarityPromiseDataCount);

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
