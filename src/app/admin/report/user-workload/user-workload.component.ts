import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../report.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { constants } from '../../helper/constants';
import { SwalService } from '../../helper/services/swal.service';
import { TitleService } from '../../helper/services/title.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { PdfService } from '../../helper/services/pdf.service';

@Component({
  selector: 'app-report-user-workload',
  templateUrl: './user-workload.component.html',
  styleUrls: ['./user-workload.component.scss']
})
export class UserWorkloadComponent implements OnInit {
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
    sortOrder: 'asc'
  };
  range: any;
  totalRecords = 0;
  tempMyItems: any[] = [];
  myItems: any[] = [];
  users: any[] = [];
  user: any;

  constructor(private reportService: ReportService,
    private toastr: ToasterService, private _ActivatedRoute: ActivatedRoute,
    private titleService: TitleService, private router: Router,
    private spinner: SpinnerService, private pdfService: PdfService) { }

  ngOnInit() {
    this.titleService.setTitle('Report', 'User Workload');
    this.users = this._ActivatedRoute.snapshot.data['data'];
    this.spinner.hide();
  }

  async findReport() {
    try {
      this.spinner.showFull();
      const res = await this.reportService.getUserWorkloadReport(
        this.user.id);

      this.tempMyItems = res.data.myItem as any[];
      this.tempMyItems.forEach((x) => {
        x.total = x.draft + x.inProgress + x.completed + x.rejected + x.withdraw;
      });
      this.totalRecords = res.data.myItem.length;
      this.range = _.range(Math.ceil(res.data.myItem.length / parseInt(this.filters.noOfPages.toString(), 0)));
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
    this.myItems = _.take(_.drop(this.tempMyItems, (parseInt(this.filters.pageNo, 0) - 1) *
      this.filters.noOfPages), this.filters.noOfPages) as any[];
  }

  gotoDetail(appId, count) {
    if (!count) {
      this.toastr.info('Info', 'No Data Available');
      return;
    }
    this.router.navigate(['/report', 'my-item', 'workload', appId]);
  }

  gotoDetailOther(status, appId, count) {
    if (!count) {
      this.toastr.info('Info', 'No Data Available');
      return;
    }
    this.router.navigate(['/report', 'my-item', status, appId]);
  }

  printReport() {
    const headers = [
      'App Name',
      'Draft',
      'In Progress',
      'Completed',
      'Rejected',
      'Withdraw',
      'Total',
    ];

    const cols = [
      'applicationName',
      'draft',
      'inProgress',
      'completed',
      'rejected',
      'withdraw',
      'total'
    ];

    const userName = this.user.firstName + ' ' + this.user.lastName;
    this.pdfService.generatePDF('', 'User Workload Report for: ' + userName, headers, cols, this.tempMyItems,
      'user-workload-report-' + userName);
  }

  getSortedResults(col) {
    this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    this.myItems = _.orderBy(this.tempMyItems, [col], [this.filters.sortOrder]);
  }
}
