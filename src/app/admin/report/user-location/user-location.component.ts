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

@Component({
  selector: 'app-user-location',
  templateUrl: './user-location.component.html',
  styleUrls: ['./user-location.component.scss']
})
export class UserLocationComponent implements OnInit {

  items: any[] = [];
  users: any[] = [];
  rptFilter: any = {
    user: null,
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD')
  };
  public coords: any = {
    latitude: null,
    longitude: null
  };

  constructor(private reportService: ReportService,
    private toastr: ToasterService,
    private _ActivatedRoute: ActivatedRoute, private titleService: TitleService,
    private spinner: SpinnerService, private dialog: MatDialog) { }

  ngOnInit() {
    this.titleService.setTitle('Report', 'User Location');
    this.users = this._ActivatedRoute.snapshot.data['data'];
    this.spinner.hide();
  }

  async findReport() {
    try {
      if (this.rptFilter.user && this.rptFilter.startDate && this.rptFilter.endDate) {
        this.spinner.showFull();
        const res = await this.reportService.getUserLocationReport(this.rptFilter.user.id,
          this.rptFilter.startDate, this.rptFilter.endDate);
        this.items = res.data as any[];
      }
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  getFromNow(tl) {
    return moment(tl).fromNow();
  }

  showMap(lt: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      latitude: lt.latitude,
      longitude: lt.longitude,
      title: this.rptFilter.user.firstName + ' ' + this.rptFilter.user.lastName
    };
    dialogConfig.width = '500px';
    const dialogRef = this.dialog.open(LocationMapModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => { });
  }
}
