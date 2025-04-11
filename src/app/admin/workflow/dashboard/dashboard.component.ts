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
    this.applications = _.filter(data, { isPublished: true });
    this.limitedApps = _.take(this.applications, 2);
    this.spinner.hide();
    setTimeout(() => {
      App.initMatchHeight();
    }, 100);
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
