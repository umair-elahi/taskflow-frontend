import { Component, OnInit } from '@angular/core';
import { ToasterService } from '../../helper/services/toaster.service';
import { SwalService } from '../../helper/services/swal.service';
import { TitleService } from '../../helper/services/title.service';
import { ActivatedRoute } from '@angular/router';
import { WorkflowService } from '../workflow.service';
import { constants } from '../../helper/constants';
import * as _ from 'lodash';
import { SpinnerService } from '../../helper/services/spinner.service';

@Component({
  selector: 'app-workflow-execution-list',
  templateUrl: './workflow-execution-list.component.html',
  styleUrls: ['./workflow-execution-list.component.scss']
})
export class WorkflowExecutionListComponent implements OnInit {

  tempList: any = [];
  lists: any = [];
  filters = {
    startDate: '',
    endDate: '',
    pageNo: '1',
    noOfPages: 10,
    searchArray: [
      {
        key: 'status',
        value: ''
      }
    ]
  };
  range: any;
  totalRecords = 0;
  applicationId: any = null;
  sub: any = null;
  constructor(private toastr: ToasterService, private swalService: SwalService, private titleService: TitleService,
    private _ActivatedRoute: ActivatedRoute, private workflowService: WorkflowService, private spinner: SpinnerService) { }

  ngOnInit() {
    this.titleService.setTitle('Workflow', 'Execution List');
    this.applicationId = this._ActivatedRoute.snapshot.paramMap.get('id');
    this.getListData();
  }

  async deleteRecord(id) {
    const { value: alertRes } = await this.swalService.deleteWarningPopup();
    if (alertRes) {
      try {
        this.spinner.showFull();
        const res = await this.workflowService.deleteExecutionById(id);
        if (res) {
          this.toastr.success('success', constants.messages.EXECUTION_DELETE_SUCCESS);
          this.getListData();
        } else {
          this.toastr.error('error', constants.messages.SERVER_ERROR);
        }
      } catch (err) {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
      }
      finally {
        this.spinner.hide();
      }
    }
  }

  async getListData() {
    try {
      this.spinner.showFull();
      let promise = null;
      if (this.applicationId !== 'new') {
        promise = this.workflowService.getAllWorkflowExecutionsByApp(this.applicationId);
      } else {
        promise = this.workflowService.getAllExecutions();
      }
      const res = await promise;

      this.tempList = res.data;
      this.totalRecords = res.data.length;
      this.range = _.range(Math.ceil(res.data.length / parseInt(this.filters.noOfPages.toString(), 0)));
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
}
