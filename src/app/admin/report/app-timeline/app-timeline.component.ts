import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '../../helper/services/title.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { ReAssignComponent } from '../../workflow/re-assign/re-assign.component';
import { MatDialog } from '@angular/material';
import { WorkflowService } from '../../workflow/workflow.service';
import { PdfService } from '../../helper/services/pdf.service';
import * as moment from 'moment';

@Component({
  selector: 'app-app-timeline',
  templateUrl: './app-timeline.component.html',
  styleUrls: ['./app-timeline.component.scss']
})
export class AppTimelineComponent implements OnInit {

  // — Pending-tasks view —
  tasks: any[] = [];
  pendingFilter = { startDate: '', endDate: '' };
  pendingLoaded = false;

  // — “Application Timeline” view —
  items: any[] = [];
  applications: any[] = [];
  users: any[] = [];
  rptFilter: any = {
    application: null,
    startDate: moment().format('YYYY-MM-DD'),
    endDate:   moment().format('YYYY-MM-DD')
  };
  filters: any = { sortOrder: 'asc' };

  constructor(
    private reportService: ReportService,
    private toastr: ToasterService,
    private route: ActivatedRoute,
    private titleService: TitleService,
    private spinner: SpinnerService,
    private dialog: MatDialog,
    private workflowService: WorkflowService,
    private pdfService: PdfService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Report', 'Application Timeline');
    const data = this.route.snapshot.data['data'];
    this.applications = data.applications;
    this.users        = data.users;
    this.spinner.hide();
  }

  /** Called whenever either date input changes */
  onDateChange() {
    const { startDate, endDate } = this.pendingFilter;
    if (startDate && endDate) {
      this.fetchPendingTasks();
    }
  }

  /** Fetch & filter tasks whose last startedAt falls in the selected range */
  private async fetchPendingTasks() {
    this.pendingLoaded = true;
    this.spinner.showFull();
    this.tasks = [];

    const { startDate, endDate } = this.pendingFilter;
    try {
      const responses = await Promise.all(
        this.applications.map(app =>
          this.reportService
            .getApplicationTimelineReport(app.id, startDate, endDate)
            .then(r => ({ appName: app.name, data: r.data }))
        )
      );

      for (const resp of responses) {
        for (const task of resp.data) {
          const tl = task.timeline;
          if (!tl.length) continue;
          const last = tl[tl.length - 1];
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
        const aT = new Date(a.timeline.slice(-1)[0].startedAt).getTime();
        const bT = new Date(b.timeline.slice(-1)[0].startedAt).getTime();
        return aT - bT;
      });

    } catch {
      this.toastr.error('Error', 'Error loading pending tasks.');
    } finally {
      this.spinner.hide();
    }
  }

  /** Clear the date inputs and hide results */
  clearPendingFilter() {
    this.pendingFilter = { startDate: '', endDate: '' };
    this.pendingLoaded = false;
    this.tasks = [];
  }

  // — Existing “Application Timeline” methods —

  async findReport() {
    try {
      if (this.rptFilter.application && this.rptFilter.startDate && this.rptFilter.endDate) {
        this.spinner.showFull();
        const res = await this.reportService.getApplicationTimelineReport(
          this.rptFilter.application.id,
          this.rptFilter.startDate,
          this.rptFilter.endDate
        );
        this.items = res.data;
      }
    } catch {
      this.toastr.error('Error', 'Server error');
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
    });

    const resp = await dialogRef.afterClosed().toPromise();
    if (resp.userId) {
      this.spinner.showFull();
      try {
        const success = await this.workflowService.reAssign(resp);
        this.toastr.success(success ? 'Success' : 'Error', success ? 'Reassigned successfully' : 'Server error');
      } catch {
        this.toastr.error('Error', 'Server error');
      } finally {
        this.spinner.hide();
      }
    }
  }

  printReport(lst: any) {
    const headers = ['Workflow', 'Started At', 'Ending At', 'Total Duration'];
    const cols    = ['workflowType', 'startedAt', 'endAt', 'timestamp'];
    const data = lst.timeline.map((x: any) => ({
      workflowType: x.workflowType,
      startedAt:    moment(x.startedAt).format('YYYY-MM-DD hh:mm:ss'),
      endAt:        moment(x.endAt).format('YYYY-MM-DD hh:mm:ss'),
      timestamp:    x.timestamp
    }));
    const title = `${lst.title} - ${this.rptFilter.application.name} Timeline Report, Period: `
      + `${this.rptFilter.startDate} - ${this.rptFilter.endDate}`;
    this.pdfService.generatePDF('', title, headers, cols, data, `app-timeline-${this.rptFilter.application.name}`);
  }

  getSortedResults(col: string, list: any) {
    this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    list.timeline = list.timeline.slice().sort((a: any, b: any) => {
      return this.filters.sortOrder === 'asc'
        ? (a[col] > b[col] ? 1 : -1)
        : (a[col] < b[col] ? 1 : -1);
    });
  }
}
