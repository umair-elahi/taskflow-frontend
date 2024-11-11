import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { constants } from '../../helper/constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurationService } from '../configuration.service';
import { SwalService } from '../../helper/services/swal.service';
import { TitleService } from '../../helper/services/title.service';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '../../helper/services/toaster.service';
import * as _ from 'lodash';
import { ISaveListModel, IListModel } from './IListModel';
import { ListDataComponent } from './list-data/list-data.component';
import { SpinnerService } from '../../helper/services/spinner.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  tempList: IListModel[];
  lists: IListModel[];
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
  listForm: FormGroup;
  isFormBinded = false;

  constructor(private fb: FormBuilder, private configurationService: ConfigurationService,
    private toastr: ToasterService, private swalService: SwalService,
    private _ActivatedRoute: ActivatedRoute, private titleService: TitleService, private dialog: MatDialog,
    private spinner: SpinnerService) { }

  ngOnInit() {
    this.titleService.setTitle('Admin', 'Lists');
    const list = this._ActivatedRoute.snapshot.data['data'].lists;
    this.totalRecords = list.length;
    this.range = _.range(Math.ceil(list.length / parseInt(this.filters.noOfPages.toString(), 0)));
    this.tempList = list as IListModel[];
    this.getPaginatedData();
    this.spinner.hide();
  }

  createForm(editDetails: ISaveListModel = null) {
    this.isFormBinded = false;
    this.listForm = this.fb.group({
      id: [editDetails ? (editDetails.id || null) : null],
      name: [editDetails ? (editDetails.name || '') : '', Validators.compose([Validators.required])],
      type: [editDetails ? (editDetails.type || '') : '', Validators.compose([Validators.required])]
    });
    this.isFormBinded = true;
  }

  add() {
    this.createForm();
  }

  edit(selectedRecords: ISaveListModel) {
    this.createForm(selectedRecords);
  }

  async save() {
    if (this.listForm.valid) {
      try {
        this.spinner.showFull();
        const res = await this.configurationService.saveList(this.listForm.value);
        if (res) {
          this.toastr.success('success', constants.messages.LIST_SAVE_SUCCESS);
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
        const res = await this.configurationService.deleteList(id);
        if (res) {
          this.toastr.success('success', constants.messages.LIST_DELETE_SUCCESS);
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
      const res = await this.configurationService.getAllLists(
        this.filters.pageNo,
        this.filters.noOfPages.toString(),
        this.filters.searchArray);

      this.tempList = res.data as IListModel[];
      this.totalRecords = res.data.length;
      this.range = _.range(Math.ceil(res.data.length / parseInt(this.filters.noOfPages.toString(), 0)));
      this.getPaginatedData();
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async openListDataDialog(lookup: any) {
    try {
      this.spinner.showFull();
      const listData = await this.configurationService.getAllListDataById(lookup.id);
      const dialogRef = this.dialog.open(ListDataComponent, {
        width: '80%',
        data: { lookupId: lookup.id, name: lookup.name, listData: listData.data }
      });
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    }
    finally {
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
    this.lists = _.take(_.drop(this.tempList, (parseInt(this.filters.pageNo, 0) - 1) *
      this.filters.noOfPages), this.filters.noOfPages) as IListModel[];
  }
}
