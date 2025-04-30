import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Applications and general arrays
  applications: any;
  limitedApps: any;
  appId: string = null;
  approvalPromise: any;
  approvalPromiseDataCount: number;
  inputPromise: any;
  inputPromiseDataCount: number;
  clarityPromise: any;
  clarityPromiseDataCount: number;

  // Filter properties (live input values)
  startDate: string;  // Expected format: YYYY-MM-DD
  endDate: string;    // Expected format: YYYY-MM-DD
  selectedTaskType: string;
  
  // Filtered task list
  filteredTasks: any[] = [];
  isSuperAdmin = false;
  isAuthenticUser = false;

  approvedTasks: any[] = [];
  pendingFilter = { startDate: '', endDate: '' };
  pendingLoaded = false;
  tasks: any[] = [];
  reportApplications: any[] = [];

  constructor(
    private titleService: TitleService, 
    private toastr: ToasterService, 
    private _ActivatedRoute: ActivatedRoute,
    private workflowService: WorkflowService, 
    private swalService: SwalService, 
    private spinner: SpinnerService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {


    const json = localStorage.getItem('user');
    if (json) {
      try {
        const user = JSON.parse(json);
        this.isSuperAdmin = Array.isArray(user.roles) && user.roles.includes('superAdmin');
        this.isAuthenticUser = Array.isArray(user.roles) && (user.roles.includes('superAdmin') || user.roles.includes('admin'));
      } catch (e) {
        console.error('Could not parse user from localStorage', e);
      }
    }
    
    await this.workflowService.getAllRawExecutionData()
    .then((res: any) => {
      res.data.forEach(task=>
        {
          if(task.status=='approved'){
            this.approvedTasks.push(task.id);
          }
        });
    });

    const paramId = this._ActivatedRoute.snapshot.paramMap.get('appId');
    this.appId = paramId === 'all' ? null : paramId;

    // Fetch execution data for each task type
    this.approvalPromise = await this.workflowService.getAllMyExecutions(
      constants.executionStatus.DRAFT, 
      ApplicationWorkflowType.APPROVAL, 
      this.appId
    );
    this.approvalPromiseDataCount = this.approvalPromise.data.length;
    
    this.inputPromise = await this.workflowService.getAllMyExecutions(
      constants.executionStatus.DRAFT, 
      ApplicationWorkflowType.INPUT, 
      this.appId
    );
    this.inputPromiseDataCount = this.inputPromise.data.length;
    
    this.clarityPromise = await this.workflowService.getAllMyExecutions(
      constants.executionStatus.CLARITY, 
      null, 
      this.appId
    );
    this.clarityPromiseDataCount = this.clarityPromise.data.length;

    // console.log('Approval Promise:', this.approvalPromise.data);
    // console.log('Input Promise:', this.inputPromise.data);
    // console.log('Clarity Promise:', this.clarityPromise.data);
    

    // for (const ele in this.inputPromise.data) {
    //   await this.workflowService.getApplicationById(this.inputPromise.data[ele].applicationId).then((res) => {
    //     return this.workflowService.getApplicationForm(res.data.id);
    //   }).then((res) => {
    //     console.log('all applications', res.data[0].applicationFormFields);
    //   })
    // }

    this.titleService.setTitle('Workflow', 'Dashboard');
    const data = this._ActivatedRoute.snapshot.data['data'].data;
    this.reportApplications = data;
    this.applications = _.filter(data, { isPublished: true });
    this.limitedApps = _.take(this.applications, 2);
    this.spinner.hide();
    setTimeout(() => {
      App.initMatchHeight();
    }, 100);
  }

  onDateChange() {
    const { startDate, endDate } = this.pendingFilter;
    if (startDate && endDate) {
      this.fetchPendingTasks();
    }
  }

  private async fetchPendingTasks() {
    this.pendingLoaded = true;
    this.spinner.showFull();
    this.tasks = [];

    const { startDate, endDate } = this.pendingFilter;
    try {
      const responses = await Promise.all(
        this.reportApplications.map(app =>
          this.workflowService
            .getApplicationTimelineReport(app.id, startDate, endDate)
            .then(r => ({ appName: app.name, data: r.data }))
        )
      );

      

      for (const resp of responses) {
        // console.log(resp.data)
        for (const task of resp.data) {
          if (this.approvedTasks.includes(task.id)) continue; // skip approved tasks
          const tl = task.timeline;
          if (!tl.length) continue;
          const last = tl[1];
          const ts = moment(last.startedAt);

          if (
            ts.isSameOrAfter(startDate, 'day') &&
            ts.isSameOrBefore(endDate, 'day')
          ) {
            last.workflowType = last.workflowType.replace(/^(approval|input) by\s*/i, '');
            task.name       = resp.appName;
            task.daysPassed = moment().diff(ts, 'days');
            this.tasks.push(task);
          }
        }
      }

      // sort by last.startedAt ascending
      this.tasks.sort((a, b) => {
        const aT = new Date(a.timeline[1].startedAt).getTime();
        const bT = new Date(b.timeline[1].startedAt).getTime();
        return aT - bT;
      });

    } catch {
      this.toastr.error('Error', 'Error loading pending tasks.');
    } finally {
      this.spinner.hide();
    }
  }
  
  clearPendingFilter() {
    this.pendingFilter = { startDate: '', endDate: '' };
    this.pendingLoaded = false;
    this.tasks = [];
  }

  // Helper function to filter tasks by 'createdAt' and sort them by date
  private filterByDate(data: any[], startDate: Date, endDate: Date): any[] {
    return data
      .filter(item => {
        const createdAtDate = new Date(item.createdAt);
        return createdAtDate >= startDate && createdAtDate <= endDate;
      })
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Automatically filter tasks based on current live filter inputs
  filterTasksByType(): void {
    // Only apply filtering if all three fields have a value; otherwise clear the filtered list.
    if (!this.startDate || !this.endDate || !this.selectedTaskType) {
      this.filteredTasks = [];
      this.cdr.detectChanges();
      return;
    }
    
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    switch (this.selectedTaskType) {
      case 'approval':
        this.filteredTasks = this.filterByDate(this.approvalPromise.data, start, end);
        break;
      case 'input':
        this.filteredTasks = this.filterByDate(this.inputPromise.data, start, end);
        break;
      case 'clarity':
        this.filteredTasks = this.filterByDate(this.clarityPromise.data, start, end);
        break;
      default:
        this.filteredTasks = [];
    }

    this.cdr.detectChanges();
  }

  // Clear all filter inputs and filtered results
  clearFilters(): void {
    this.selectedTaskType = '';
    this.startDate = '';
    this.endDate = '';
    this.filteredTasks = [];
    this.cdr.detectChanges();
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
      // Optionally handle exceptions here
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
