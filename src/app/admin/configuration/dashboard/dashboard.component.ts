import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '../../helper/services/title.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { IDashboardModel } from './IDashboardModel';
import { SpinnerService } from '../../helper/services/spinner.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashBoardCounts: IDashboardModel;

  constructor(
    private titleService: TitleService,
    private toastr: ToasterService,
    private _ActivatedRoute: ActivatedRoute,
    private spinnerService: SpinnerService // Inject SpinnerService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Admin', 'Dashboard');
    this.dashBoardCounts = this._ActivatedRoute.snapshot.data['data'].data as IDashboardModel;

    // Call hideFull() method of SpinnerService to hide the spinner
    this.spinnerService.hideFull();
  }
}
