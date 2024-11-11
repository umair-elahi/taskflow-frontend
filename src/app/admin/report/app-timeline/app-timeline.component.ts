import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '../../helper/services/title.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { constants } from '../../helper/constants';
import { ReAssignComponent } from '../../workflow/re-assign/re-assign.component';
import { ConfigurationService } from '../../configuration/configuration.service';
import { MatDialog } from '@angular/material';
import { WorkflowService } from '../../workflow/workflow.service';
import { PdfService } from '../../helper/services/pdf.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-app-timeline',
  templateUrl: './app-timeline.component.html',
  styleUrls: ['./app-timeline.component.scss']
})
export class AppTimelineComponent implements OnInit {

  items: any[] = [];
  applications: any[] = [];
  users: any[] = [];
  rptFilter: any = {
    application: null,
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD')
  };
  filters: any = {
    sortOrder: 'asc'
  };

  constructor(private reportService: ReportService,
    private toastr: ToasterService,
    private _ActivatedRoute: ActivatedRoute, private titleService: TitleService,
    private spinner: SpinnerService, private configurationService: ConfigurationService,
    private dialog: MatDialog, private workflowService: WorkflowService, private pdfService: PdfService) { }

  ngOnInit() {
    this.titleService.setTitle('Report', 'Application Timeline');
    this.applications = this._ActivatedRoute.snapshot.data['data'].applications;
    this.users = this._ActivatedRoute.snapshot.data['data'].users;
    this.spinner.hide();
  }

  async findReport() {
    try {
      if (this.rptFilter.application && this.rptFilter.startDate && this.rptFilter.endDate) {
        this.spinner.showFull();
        const res = await this.reportService.getApplicationTimelineReport(this.rptFilter.application.id,
          this.rptFilter.startDate, this.rptFilter.endDate);
        this.items = res.data as any[];
      }
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async sendForReassign(data: any) {
    const dialogRef = this.dialog.open(ReAssignComponent, {
      width: '700px',
      data: {
        appId: data.applicationId,
        executionId: data.id,
        workflowId: data.timeline[data.timeline.length - 1].applicationWorkflowId,
        users: this.users
      }
    }).afterClosed().toPromise().then(async (resp) => {
      if (resp && resp.userId) {
        try {
          this.spinner.showFull();
          const res = await this.workflowService.reAssign(resp);
          if (res) {
            this.toastr.success('success', constants.messages.REASSIGN_SUCCESS);
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
    });
  }

  printReport(lst) {
    const headers = [
      'Workflow',
      'Started At',
      'Ending At',
      'Total Duration'
    ];

    const cols = [
      'workflowType',
      'startedAt',
      'endAt',
      'timestamp'
    ];

    const data = lst.timeline.map((x) => {
      return {
        workflowType: x.workflowType,
        startedAt: moment(x.startedAt).format('YYYY-MM-DD hh:mm:ss'),
        endAt: moment(x.endAt).format('YYYY-MM-DD hh:mm:ss'),
        timestamp: x.timestamp,
      };
    });
    const userName = lst.title + ' - ' + this.rptFilter.application.name + ' Timeline Report, Period: '
      + this.rptFilter.startDate + ' - ' + this.rptFilter.endDate;
    this.pdfService.generatePDF('', userName, headers, cols, data,
      'app-timeline-' + this.rptFilter.application.name);
  }

  getSortedResults(col, list) {
    this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    list.timeline = _.orderBy(list.timeline, [col], [this.filters.sortOrder]);
  }
}
