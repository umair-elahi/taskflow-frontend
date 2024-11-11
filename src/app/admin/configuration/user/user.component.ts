import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../configuration.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { constants } from '../../helper/constants';
import { SwalService } from '../../helper/services/swal.service';
import { TitleService } from '../../helper/services/title.service';
import * as _ from 'lodash';
import { IUserModel } from './IUserModel';
import { SpinnerService } from '../../helper/services/spinner.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  filters = {
    startDate: '',
    endDate: '',
    pageNo: '1',
    noOfPages: 10,
    searchText: [{
      key: 'FirstName',
      value: ''
    }, {
      key: 'LastName',
      value: ''
    }, {
      key: 'Username',
      value: ''
    }]
  };
  range: any;
  totalRecords = 0;
  users: IUserModel[];
  tempUsers: IUserModel[];
  constructor(private configurationService: ConfigurationService,
    private toastr: ToasterService, private swalService: SwalService,
    private _ActivatedRoute: ActivatedRoute, private titleService: TitleService,
    private spinner: SpinnerService) { }

  ngOnInit() {
    this.titleService.setTitle('Admin', 'Users');
    const list = this._ActivatedRoute.snapshot.data['data'].users;
    this.totalRecords = list.length;
    this.range = _.range(Math.ceil(list.length / parseInt(this.filters.noOfPages.toString(), 0)));
    this.tempUsers = list as IUserModel[];
    this.getPaginatedData();
    this.spinner.hide();
  }

  async getListData() {
    try {
      this.spinner.showFull();
      const res = await this.configurationService.getUsers(
        this.filters.pageNo,
        this.filters.noOfPages.toString(), ['']);

      this.users = res.data as IUserModel[];
      this.totalRecords = res.data.length;
      this.range = _.range(Math.ceil(res.data.length / parseInt(this.filters.noOfPages.toString(), 0)));
      this.getPaginatedData();
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async deleteUser(id) {
    const { value: alertRes } = await this.swalService.deleteWarningPopup();
    if (alertRes) {
      try {
        this.spinner.showFull();
        const res = await this.configurationService.deleteUser(id);
        if (res) {
          this.toastr.success('success', constants.messages.USER_DELETE_SUCCESS);
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
    this.users = _.take(_.drop(this.tempUsers, (parseInt(this.filters.pageNo, 0) - 1) *
      this.filters.noOfPages), this.filters.noOfPages) as IUserModel[];
  }
}
