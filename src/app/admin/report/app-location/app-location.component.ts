import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../helper/services/spinner.service';
import { TitleService } from '../../helper/services/title.service';
import { constants } from '../../helper/constants';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { LocationMapModalComponent } from '../location-map-modal/location-map-modal.component';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-app-location',
  templateUrl: './app-location.component.html',
  styleUrls: ['./app-location.component.scss']
})
export class AppLocationComponent implements OnInit {

  items: any[] = [];
  applications: any[] = [];
  rptFilter: any = {
    application: null,
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD')
  };
  public coords: any = {
    latitude: null,
    longitude: null
  };
  filters: any = {
    sortOrder: 'asc'
  };

  constructor(private reportService: ReportService,
    private toastr: ToasterService,
    private _ActivatedRoute: ActivatedRoute, private titleService: TitleService,
    private spinner: SpinnerService, private dialog: MatDialog) { }

  ngOnInit() {
    this.titleService.setTitle('Report', 'Application Location');
    this.applications = this._ActivatedRoute.snapshot.data['data'];
    this.spinner.hide();
  }

  async findReport() {
    try {
      if (this.rptFilter.application && this.rptFilter.startDate && this.rptFilter.endDate) {
        this.spinner.showFull();
        const res = await this.reportService.getApplicationLocationReport(this.rptFilter.application.id,
          this.rptFilter.startDate, this.rptFilter.endDate);
        this.items = res.data as any[];
      }
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  showMap(lt: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      latitude: lt.latitude,
      longitude: lt.longitude,
      title: lt.title
    };
    dialogConfig.width = '500px';
    const dialogRef = this.dialog.open(LocationMapModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => { });
  }

  getSortedResults(col) {
    this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    this.items = _.orderBy(this.items, [col], [this.filters.sortOrder]);
  }
}
