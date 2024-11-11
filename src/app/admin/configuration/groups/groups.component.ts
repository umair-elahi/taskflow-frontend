import { Component, OnInit } from '@angular/core';
import { IGroupModel, ISaveGroupModel } from './IGroupModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from '../../helper/services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { SwalService } from '../../helper/services/swal.service';
import { ConfigurationService } from '../configuration.service';
import { TitleService } from '../../helper/services/title.service';
import { constants } from '../../helper/constants';
import * as _ from 'lodash';
import { SpinnerService } from '../../helper/services/spinner.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  tempList: IGroupModel[];
  groups: IGroupModel[];
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
  groupForm: FormGroup;
  isFormBinded = false;
  users: any = [];

  constructor(private fb: FormBuilder, private configurationService: ConfigurationService,
    private toastr: ToasterService, private swalService: SwalService,
    private _ActivatedRoute: ActivatedRoute, private titleService: TitleService,
    private spinner: SpinnerService) { }

  ngOnInit() {
    this.titleService.setTitle('Admin', 'Groups');
    const list = this._ActivatedRoute.snapshot.data['data'].groups;
    this.users = this._ActivatedRoute.snapshot.data['data'].users;
    this.totalRecords = list.length;
    this.range = _.range(Math.ceil(list.length / parseInt(this.filters.noOfPages.toString(), 0)));
    this.tempList = list as IGroupModel[];
    this.getPaginatedData();
    this.spinner.hide();
  }

  createForm(editDetails: ISaveGroupModel = null) {
    this.isFormBinded = false;
    this.groupForm = this.fb.group({
      id: [editDetails ? (editDetails.id || 0) : 0],
      name: [editDetails ? (editDetails.name || '') : '', Validators.compose([Validators.required])],
      userIds: [editDetails ? (editDetails.userIds || []) : []]
    });
    this.isFormBinded = true;
  }

  add() {
    this.createForm();
  }

  edit(selectedRecords: ISaveGroupModel) {
    this.createForm(selectedRecords);
  }

  async save() {
    if (this.groupForm.valid) {
      try {
        this.spinner.showFull();
        const res = await this.configurationService.saveGroup(this.groupForm.value);
        if (res) {
          this.toastr.success('success', constants.messages.GROUP_SAVE_SUCCESS);
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
      try {
        this.spinner.showFull();
        const res = await this.configurationService.deleteGroup(id);
        if (res) {
          this.toastr.success('success', constants.messages.GROUP_DELETE_SUCCESS);
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
      const res = await this.configurationService.getGroups(
        this.filters.pageNo,
        this.filters.noOfPages.toString(),
        this.filters.searchArray);

      this.tempList = res.data as IGroupModel[];
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
    this.groups = _.take(_.drop(this.tempList, (parseInt(this.filters.pageNo, 0) - 1) *
      this.filters.noOfPages), this.filters.noOfPages) as IGroupModel[];
  }

}
