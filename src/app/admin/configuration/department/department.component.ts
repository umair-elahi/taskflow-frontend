import { Component, OnInit } from '@angular/core';
import { constants } from '../../helper/constants';
import { IDepartmentModel, ISaveDepartmentModel } from './IDepartmentModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurationService } from '../configuration.service';
import { SwalService } from '../../helper/services/swal.service';
import { TitleService } from '../../helper/services/title.service';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '../../helper/services/toaster.service';
import * as _ from 'lodash';
import { SpinnerService } from '../../helper/services/spinner.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  tempList: IDepartmentModel[];
  departments: IDepartmentModel[];
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
  departmentForm: FormGroup;
  isFormBinded = false;
  users: any = [];

  constructor(private fb: FormBuilder, private configurationService: ConfigurationService,
    private toastr: ToasterService, private swalService: SwalService,
    private _ActivatedRoute: ActivatedRoute, private titleService: TitleService,
    private spinner: SpinnerService) { }

  ngOnInit() {
    this.titleService.setTitle('Admin', 'Departments');
    const list = this._ActivatedRoute.snapshot.data['data'].departments;
    this.users = this._ActivatedRoute.snapshot.data['data'].users;
    this.totalRecords = list.length;
    this.range = _.range(Math.ceil(list.length / parseInt(this.filters.noOfPages.toString(), 0)));
    this.tempList = list as IDepartmentModel[];
    this.getPaginatedData();
    this.spinner.hide();
  }

  createForm(editDetails: ISaveDepartmentModel = null) {
    this.isFormBinded = false;
    this.departmentForm = this.fb.group({
      id: [editDetails ? (editDetails.id || null) : null],
      name: [editDetails ? (editDetails.name || '') : '', Validators.compose([Validators.required])],
      userId: [editDetails ? (editDetails.userId || null) : null]
    });
    this.isFormBinded = true;
  }

  add() {
    this.createForm();
  }

  edit(selectedRecords: ISaveDepartmentModel) {
    this.createForm(selectedRecords);
  }

  async save() {
    if (this.departmentForm.valid) {
      try {
        this.spinner.showFull();
        const res = await this.configurationService.saveDepartment(this.departmentForm.value);
        if (res) {
          this.toastr.success('success', constants.messages.DEPARTMENT_SAVE_SUCCESS);
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
        const res = await this.configurationService.deleteDepartment(id);
        if (res) {
          this.toastr.success('success', constants.messages.DEPARTMENT_DELETE_SUCCESS);
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
      this.spinner.showSpinner();
      const res = await this.configurationService.getDepartments(
        this.filters.pageNo,
        this.filters.noOfPages.toString(),
        this.filters.searchArray);

      this.tempList = res.data as IDepartmentModel[];
      this.totalRecords = res.data.length;
      this.range = _.range(Math.ceil(res.data.length / parseInt(this.filters.noOfPages.toString(), 0)));
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
    this.departments = _.take(_.drop(this.tempList, (parseInt(this.filters.pageNo, 0) - 1) *
      this.filters.noOfPages), this.filters.noOfPages) as IDepartmentModel[];
  }
}
