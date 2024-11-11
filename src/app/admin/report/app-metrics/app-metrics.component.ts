import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleService } from '../../helper/services/title.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { constants } from '../../helper/constants';
import { Chart } from 'angular-highcharts';
import * as moment from 'moment';

@Component({
  selector: 'app-app-metrics',
  templateUrl: './app-metrics.component.html',
  styleUrls: ['./app-metrics.component.scss']
})
export class AppMetricsComponent implements OnInit {

  items: any = {
    total: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0
  };
  applications: any[] = [];
  rptFilter: any = {
    application: null,
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD')
  };
  chart: any = null;
  pieChart: any = null;

  constructor(private reportService: ReportService,
    private toastr: ToasterService,
    private _ActivatedRoute: ActivatedRoute, private titleService: TitleService,
    private spinner: SpinnerService, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle('Report', 'Application Metrics');
    this.applications = this._ActivatedRoute.snapshot.data['data'];
    this.spinner.hide();
    this.initCharts();
  }

  async findReport() {
    try {
      if (this.rptFilter.application && this.rptFilter.startDate && this.rptFilter.endDate) {
        this.spinner.showFull();
        const res = await this.reportService.getApplicationMetricsReport(this.rptFilter.application.id,
          this.rptFilter.startDate, this.rptFilter.endDate);
        this.items = res.data;
        this.initCharts();
      }
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  initCharts() {
    this.initBarChart();
    this.initPieChart();
  }

  initPieChart() {
    this.pieChart = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Usage Graph'
      },
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        type: 'pie',
        name: 'Workflows',
        data: [{
          name: 'Completed',
          y: this.items.completed,
          events: {
            click: (e) => {
              if (this.rptFilter.application) {
                this.gotoDetail('approved', this.rptFilter.application.id, this.items.completed);
              }
            }
          }
        }, {
          name: 'In Progress',
          y: this.items.inProgress,
          events: {
            click: (e) => {
              if (this.rptFilter.application) {
                this.gotoDetail('draft', this.rptFilter.application.id, this.items.inProgress);
              }
            }
          }
        }, {
          name: 'Rejected',
          y: this.items.rejected,
          events: {
            click: (e) => {
              if (this.rptFilter.application) {
                this.gotoDetail('rejected', this.rptFilter.application.id, this.items.rejected);
              }
            }
          }
        }, {
          name: 'Withdraw',
          y: this.items.withdraw,
          events: {
            click: (e) => {
              if (this.rptFilter.application) {
                this.gotoDetail('withdraw', this.rptFilter.application.id, this.items.withdraw);
              }
            }
          }
        }]
      }]
    });
  }

  initBarChart() {
    this.chart = new Chart({
      chart: {
        type: 'column'
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Application Metrics'
      },
      xAxis: {
        categories: ['Completed', 'In Progress', 'Rejected', 'Withdraw']
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Application Metrics Counts'
        }
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b>:',
        pointFormat: '{point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          },
          showInLegend: true
        }
      },
      series: [{
        type: 'column',
        name: '',
        data: [this.items.completed, this.items.inProgress, this.items.rejected, this.items.withdraw],
        events: {
          click: (e) => {
            if (e.point.category === 'Completed') {
              this.gotoDetail('approved', this.rptFilter.application.id, this.items.completed);
            }
            if (e.point.category === 'In Progress') {
              this.gotoDetail('draft', this.rptFilter.application.id, this.items.inProgress);
            }
            if (e.point.category === 'Rejected') {
              this.gotoDetail('rejected', this.rptFilter.application.id, this.items.rejected);
            }
            if (e.point.category === 'Withdraw') {
              this.gotoDetail('withdraw', this.rptFilter.application.id, this.items.withdraw);
            }
          }
        }
      }]
    });
  }

  gotoDetail(status, appId, count) {
    if (!count) {
      this.toastr.info('Info', 'No Data Available');
      return;
    }
    let url = '/report/my-item/' + status + '/' + appId;
    if (this.rptFilter.startDate) {
      url += '?startDate=' + this.rptFilter.startDate;
    } if (this.rptFilter.endDate) {
      url += '&endDate=' + this.rptFilter.endDate;
    }
    this.router.navigateByUrl(url);
  }
}
