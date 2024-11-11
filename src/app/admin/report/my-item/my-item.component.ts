import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../report.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { constants } from '../../helper/constants';
import { TitleService } from '../../helper/services/title.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { IMyItemReport } from './interface';
import { PdfService } from '../../helper/services/pdf.service';

@Component({
  selector: 'app-report-my-item',
  templateUrl: './my-item.component.html',
  styleUrls: ['./my-item.component.scss']
})
export class MyItemComponent implements OnInit {
  filters = {
    startDate: '',
    endDate: '',
    pageNo: '1',
    noOfPages: 10,
    searchArray: [
      {
        key: 'Name',
        value: ''
      }
    ],
    sortCol: '',
    sortOrder: 'asc',
  };
  participatedFilter = {
    pageNo: '1',
    noOfPages: 10,
    sortCol: '',
    sortOrder: 'asc',
  };
  range: any;
  rangeParticipated: any;
  totalRecords = 0;
  totalRecordsParticipated = 0;
  tempMyItems: any[] = [];
  myItems: any[] = [];
  tempParticipatedItems: any[] = [];
  participatedItems: any[] = [];

  constructor(private reportService: ReportService, private router: Router,
    private toastr: ToasterService, private _ActivatedRoute: ActivatedRoute, private titleService: TitleService,
    private spinner: SpinnerService, private pdfService: PdfService) { }

ngOnInit() {
    this.titleService.setTitle('Report', 'My Items');
    this.myItems = this._ActivatedRoute.snapshot.data['data'].myItem;
    this.participatedItems = this._ActivatedRoute.snapshot.data['data'].participated;
    this.totalRecords = this.myItems.length;
    this.range = _.range(Math.ceil(this.myItems.length / parseInt(this.filters.noOfPages.toString(), 0)));
    this.rangeParticipated = _.range(Math.ceil(this.participatedItems.length / parseInt(this.participatedFilter.noOfPages.toString(), 0)));
    this.tempMyItems = this.myItems as IMyItemReport[];
    this.tempParticipatedItems = this.participatedItems as IMyItemReport[];
    this.getPaginatedData();
    this.spinner.hide();
}


  async getMyItemReports() {
    try {
      this.spinner.showFull();
      const res = await this.reportService.getMyItemReport(
        this.filters.pageNo,
        this.filters.noOfPages.toString(),
        this.filters.searchArray);

      this.tempMyItems = res.data.myItem as IMyItemReport[];
      this.totalRecords = res.data.myItem.length;
      this.totalRecordsParticipated = res.data.participated.length;
      this.range = _.range(Math.ceil(res.data.myItem.length / parseInt(this.filters.noOfPages.toString(), 0)));
      this.rangeParticipated = _.range(Math.ceil(res.data.participated.length / parseInt(this.participatedFilter.noOfPages.toString(), 0)));
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

  goToPageParticipated(pageNo) {
    this.participatedFilter.pageNo = pageNo + 1;
    this.getPaginatedDataParticipated();
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

  goToNextParticipated() {
    if (this.participatedFilter.pageNo !== (parseInt(this.rangeParticipated[this.rangeParticipated.length - 1], 0) + 1).toString()) {
      this.participatedFilter.pageNo = (parseInt(this.participatedFilter.pageNo, 0) + 1).toString();
      this.getPaginatedDataParticipated();
    }
  }

  goToPreviousParticipated() {
    if (this.participatedFilter.pageNo !== '1') {
      this.participatedFilter.pageNo = (parseInt(this.participatedFilter.pageNo, 0) - 1).toString();
      this.getPaginatedDataParticipated();
    }
  }

  getPaginatedData() {
    this.myItems = _.take(_.drop(this.tempMyItems, (parseInt(this.filters.pageNo, 0) - 1) *
      this.filters.noOfPages), this.filters.noOfPages) as IMyItemReport[];
  }

  getPaginatedDataParticipated() {
    this.participatedItems = _.take(_.drop(this.tempParticipatedItems, (parseInt(this.participatedFilter.pageNo, 0) - 1) *
      this.participatedFilter.noOfPages), this.participatedFilter.noOfPages) as IMyItemReport[];
  }

  gotoDetail(status, appId, count) {
    if (!count) {
      this.toastr.info('Info', 'No Data Available');
      return;
    }
    this.router.navigate(['/report', 'my-item', status, appId]);
  }

  printMyItemReport() {
    const headers = [
      'App Name',
      'Draft',
      'In Progress',
      'Completed',
      'Rejected',
      'Withdraw'
    ];
    const cols = [
      'applicationName',
      'draft',
      'inProgress',
      'completed',
      'rejected',
      'withdraw'
    ];

    this.pdfService.generatePDF('', 'My Item Report', headers, cols, this.tempMyItems, 'my-item-report');
  }

  printTaskIWorkReport() {
    const headers = [
      'App Name',
      'Draft',
      'In Progress',
      'Completed',
      'Rejected',
      'Withdraw'
    ];
    const cols = [
      'applicationName',
      'draft',
      'inProgress',
      'completed',
      'rejected',
      'withdraw'
    ];

    this.pdfService.generatePDF('', 'Tasks I Worked On Report', headers, cols, this.tempParticipatedItems, 'task-i-worked-on-report');
  }

  getSortedResults(col) {
    this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    this.myItems = _.orderBy(this.tempMyItems, [col], [this.filters.sortOrder]);
  }

  getParticipatedSortedResults(col) {
    this.participatedFilter.sortOrder = this.participatedFilter.sortOrder === 'asc' ? 'desc' : 'asc';
    this.participatedItems = _.orderBy(this.tempParticipatedItems, [col], [this.participatedFilter.sortOrder]);
  }
}
