import { Component, OnInit } from '@angular/core';
import { IOfficeLocationModel, ISaveOfficeLocationModel } from './IOfficeLocationModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationService } from '../configuration.service';
import { TitleService } from '../../helper/services/title.service';
import { SwalService } from '../../helper/services/swal.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { constants } from '../../helper/constants';
import * as _ from 'lodash';
import { SpinnerService } from '../../helper/services/spinner.service';

@Component({
  selector: 'app-office-location',
  templateUrl: './office-location.component.html',
  styleUrls: ['./office-location.component.scss']
})
export class OfficeLocationComponent implements OnInit {

  tempList: IOfficeLocationModel[];
  officeLocations: IOfficeLocationModel[];
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
    ]
  };
  range: any;
  totalRecords = 0;
  officeLocationForm: FormGroup;
  isFormBinded = false;
  users: any = [];

  constructor(private fb: FormBuilder, private configurationService: ConfigurationService,
    private toastr: ToasterService, private swalService: SwalService,
    private _ActivatedRoute: ActivatedRoute, private titleService: TitleService,
    private spinner: SpinnerService) { }

  ngOnInit() {
    this.titleService.setTitle('Admin', 'Office Location');
    const list = this._ActivatedRoute.snapshot.data['data'].officeLocations;
    this.users = this._ActivatedRoute.snapshot.data['data'].users;
    this.totalRecords = list.length;
    this.range = _.range(Math.ceil(list.length / parseInt(this.filters.noOfPages.toString(), 0)));
    this.tempList = list as IOfficeLocationModel[];
    this.getPaginatedData();
    this.spinner.hide();
  }

  createForm(editDetails: ISaveOfficeLocationModel = null) {
    this.isFormBinded = false;
    this.officeLocationForm = this.fb.group({
      id: [editDetails ? (editDetails.id || null) : null],
      name: [editDetails ? (editDetails.name || '') : '', Validators.compose([Validators.required])],
      userId: [editDetails ? (editDetails.userId || null) : null]
    });
    this.isFormBinded = true;
  }

  add() {
    this.createForm();
  }

  edit(selectedRecords: ISaveOfficeLocationModel) {
    this.createForm(selectedRecords);
  }

  async save() {
    if (this.officeLocationForm.valid) {
      try {
        this.spinner.showFull();
        const res = await this.configurationService.saveOfficeLocation(this.officeLocationForm.value);
        if (res) {
          this.toastr.success('success', constants.messages.OFFICE_LOCATION_SAVE_SUCCESS);
          this.getListData();
          this.isFormBinded = !this.isFormBinded;
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

  async deleteRecord(id) {
    const { value: alertRes } = await this.swalService.deleteWarningPopup();
    if (alertRes) {
      this.spinner.showFull();
      try {
        const res = await this.configurationService.deleteOfficeLocation(id);
        if (res) {
          this.toastr.success('success', constants.messages.OFFICE_LOCATION_DELETE_SUCCESS);
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
      await this.configurationService.getOfficeLocations(
        this.filters.pageNo,
        this.filters.noOfPages.toString(),
        this.filters.searchArray)
        .then((res: any) => {
          this.tempList = res.data as IOfficeLocationModel[];
          this.totalRecords = res.data.length;
          this.range = _.range(Math.ceil(res.data.length / parseInt(this.filters.noOfPages.toString(), 0)));
          this.getPaginatedData();
        });
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
    this.officeLocations = _.take(_.drop(this.tempList, (parseInt(this.filters.pageNo, 0) - 1) *
      this.filters.noOfPages), this.filters.noOfPages) as IOfficeLocationModel[];
  }
}
