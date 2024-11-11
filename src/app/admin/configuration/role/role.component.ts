import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../configuration.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { constants } from '../../helper/constants';
import { SwalService } from '../../helper/services/swal.service';
import { TitleService } from '../../helper/services/title.service';
import * as _ from 'lodash';
import { IRoleModel, ISaveRoleModel } from './IRoleModel';
import { SpinnerService } from '../../helper/services/spinner.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  tempList: IRoleModel[];
  roles: IRoleModel[];
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
  roleForm: FormGroup;
  isFormBinded = false;
  rights: any = [];

  constructor(private fb: FormBuilder, private configurationService: ConfigurationService,
    private toastr: ToasterService, private swalService: SwalService,
    private _ActivatedRoute: ActivatedRoute, private titleService: TitleService,
    private spinner: SpinnerService) { }

  ngOnInit() {
    this.titleService.setTitle('Admin', 'Roles');
    const list = this._ActivatedRoute.snapshot.data['data'].roles;
    this.rights = this._ActivatedRoute.snapshot.data['data'].rights;
    this.totalRecords = list.data.length;
    this.range = _.range(Math.ceil(list.data.length / parseInt(this.filters.noOfPages.toString(), 0)));
    this.tempList = list.data as IRoleModel[];
    this.getPaginatedData();
    this.spinner.hide();
  }

  createForm(editDetails: ISaveRoleModel = null) {
    this.isFormBinded = false;
    this.roleForm = this.fb.group({
      id: [editDetails ? (editDetails.id || 0) : 0],
      name: [editDetails ? (editDetails.name || '') : '', Validators.compose([Validators.required])],
      rightsIds: [editDetails ? (editDetails.rightsIds || []) : []]
    });
    this.isFormBinded = true;
  }

  addRole() {
    this.createForm();
  }

  editRole(selectedRole: ISaveRoleModel) {
    this.createForm(selectedRole);
  }

  async saveRole() {
    if (this.roleForm.valid) {
      try {
        this.spinner.showFull();
        this.roleForm.value.RoleIds = [];
        const res = await this.configurationService.saveRole(this.roleForm.value);
        if (res) {
          this.toastr.success('success', constants.messages.ROLE_SAVE_SUCCESS);
          this.getRoles();
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

  async deleteRole(id) {
    const { value: alertRes } = await this.swalService.deleteWarningPopup();
    if (alertRes) {
      try {
        this.spinner.showFull();
        const res = await this.configurationService.deleteRole(id);
        if (res) {
          this.toastr.success('success', constants.messages.ROLE_DELETE_SUCCESS);
          this.getRoles();
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

  async getRoles() {
    try {
      this.spinner.showFull();
      const res = await this.configurationService.getRoles(
        this.filters.pageNo,
        this.filters.noOfPages.toString(),
        this.filters.searchArray);

      this.tempList = res.data as IRoleModel[];
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
    this.roles = _.take(_.drop(this.tempList, (parseInt(this.filters.pageNo, 0) - 1) *
      this.filters.noOfPages), this.filters.noOfPages) as IRoleModel[];
  }
}
