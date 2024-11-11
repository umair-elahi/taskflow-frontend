import { Component, OnInit } from '@angular/core';
import { ApplicationWorkflowType } from '../../helper/enum';
import { constants } from '../../helper/constants';
import { ToasterService } from '../../helper/services/toaster.service';
import { TitleService } from '../../helper/services/title.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkflowService } from '../../workflow/workflow.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-my-item-detail',
  templateUrl: './my-item-detail.component.html',
  styleUrls: ['./my-item-detail.component.scss']
})
export class MyItemDetailComponent implements OnInit {

  tempList: any = [];
  lists: any = [];
  filters = {
    startDate: '',
    endDate: '',
    pageNo: '1',
    noOfPages: 10,
    sortCol: '',
    sortOrder: 'asc',
    searchArray: [
      {
        key: 'status',
        value: ''
      }
    ]
  };
  range: any;
  totalRecords = 0;
  status = '';
  title = '';
  appId: string = null;

  constructor(private toastr: ToasterService, private titleService: TitleService,
    private router: Router, private workflowService: WorkflowService, private spinner: SpinnerService,
    private _activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    this.setTitle();
    const paramId = this._activatedRoute.snapshot.paramMap.get('appId');
    this.appId = paramId === 'all' ? null : paramId;
    const startDate = this._activatedRoute.snapshot.queryParamMap.get('startDate');
    const endDate = this._activatedRoute.snapshot.queryParamMap.get('endDate');
    if (startDate) {
      this.filters.startDate = startDate;
    } if (endDate) {
      this.filters.endDate = endDate;
    }

    await this.getListData();
  }

  setTitle() {
    const splitArr = this.router.url.split('/');
    const url = '/' + splitArr[1] + '/' + splitArr[2] + '/' + splitArr[3];
    switch (url.toLowerCase()) {
      case '/report/my-item/approvals':
        this.status = ApplicationWorkflowType.APPROVAL;
        this.title = 'Approvals';
        this.titleService.setTitle('Workflow', this.title);
        break;
      case '/report/my-item/input-request':
        this.status = ApplicationWorkflowType.INPUT;
        this.title = 'Input Requests';
        this.titleService.setTitle('Report', this.title);
        break;
      case '/report/my-item/approved':
        this.status = constants.executionStatus.APPROVED;
        this.title = 'Approved';
        this.titleService.setTitle('Report', this.title);
        break;
      case '/report/my-item/rejected':
        this.status = constants.executionStatus.REJECT;
        this.title = 'Rejected';
        this.titleService.setTitle('Report', this.title);
        break;
      case '/report/my-item/draft':
        this.status = constants.executionStatus.DRAFT;
        this.title = 'In Progress';
        this.titleService.setTitle('Report', this.title);
        break;
      case '/report/my-item/clarification':
        this.status = constants.executionStatus.CLARITY;
        this.title = 'Clarifications';
        this.titleService.setTitle('Report', this.title);
        break;
      case '/report/my-item/participated':
        this.status = constants.executionStatus.PARTICIPATED;
        this.title = 'Participated';
        this.titleService.setTitle('Report', this.title);
        break;
      case '/report/my-item/workload':
        this.status = constants.executionStatus.WORKLOAD;
        this.title = 'User Workload Detail';
        this.titleService.setTitle('Report', this.title);
        break;
      case '/report/my-item/withdraw':
        this.status = constants.executionStatus.WITHDRAW;
        this.title = 'Withdraw';
        this.titleService.setTitle('Report', this.title);
        break;
      default:
        this.status = constants.executionStatus.APPROVED;
        this.title = 'Approved';
        this.titleService.setTitle('Report', this.title);
    }
  }

  async getListData() {
    try {
      this.spinner.showFull();
      let promise = null;
      switch (this.status) {
        case ApplicationWorkflowType.APPROVAL:
          promise = this.workflowService.getAllMyExecutions(constants.executionStatus.DRAFT, ApplicationWorkflowType.APPROVAL, this.appId,
            this.filters.startDate, this.filters.endDate);
          break;
        case ApplicationWorkflowType.INPUT:
          promise = this.workflowService.getAllMyExecutions(constants.executionStatus.DRAFT, ApplicationWorkflowType.INPUT, this.appId,
            this.filters.startDate, this.filters.endDate);
          break;
        case constants.executionStatus.DRAFT:
          promise = this.workflowService.getInProgressExecution(this.appId,
            this.filters.startDate, this.filters.endDate);
          break;
        case constants.executionStatus.PARTICIPATED:
          promise = this.workflowService.getMyParticipatedExecution('', this.filters.startDate, this.filters.endDate);
          break;
        case constants.executionStatus.WITHDRAW:
          promise = this.workflowService.getMyWithdrawExecution({
            applicationId: this.appId,
            startDate: this.filters.startDate,
            endDate: this.filters.endDate
          });
          break;
        case constants.executionStatus.WORKLOAD:
          promise = Promise.all([
            this.workflowService.getAllMyExecutions(constants.executionStatus.DRAFT, ApplicationWorkflowType.APPROVAL, this.appId,
              this.filters.startDate, this.filters.endDate),
            this.workflowService.getAllMyExecutions(constants.executionStatus.DRAFT, ApplicationWorkflowType.INPUT, this.appId,
              this.filters.startDate, this.filters.endDate),
            this.workflowService.getInProgressExecution(this.appId)
          ]);
          break;
        default:
          promise = this.workflowService.getAllMyExecutions(this.status, null, this.appId,
            this.filters.startDate, this.filters.endDate);
      }
      const res: any = await promise;
      if (this.status === constants.executionStatus.WORKLOAD) {
        const arrRes = res;
        this.tempList = _.concat(arrRes[0].data, arrRes[1].data, arrRes[2].data);
      } else {
        this.tempList = res.data;
      }
      this.totalRecords = this.tempList.length;
      this.range = _.range(Math.ceil(this.totalRecords / parseInt(this.filters.noOfPages.toString(), 0)));
      this.getPaginatedData();
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  goToPage(pageNo) {
    this.filters.pageNo = pageNo + 1;
    this.getPaginatedData();
  }

  goToNext() {
    if (this.filters.pageNo !== (parseInt(this.range[this.range.length - 1], 0) + 1).toString()) {
      this.filters.pageNo = (parseInt(this.filters.pageNo, 0) + 1).toString();
      this.getPaginatedData();
    }
  }

  goToPrevious() {
    if (this.filters.pageNo !== '1') {
      this.filters.pageNo = (parseInt(this.filters.pageNo, 0) - 1).toString();
      this.getPaginatedData();
    }
  }

  getPaginatedData() {
    this.lists = _.take(_.drop(this.tempList, (parseInt(this.filters.pageNo, 0) - 1) *
      this.filters.noOfPages), this.filters.noOfPages);
  }

  getSortedResults(col) {
    this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    this.lists = _.orderBy(this.tempList, [col], [this.filters.sortOrder]);
  }
}
