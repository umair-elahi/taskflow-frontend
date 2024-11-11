import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToasterService } from 'src/app/admin/helper/services/toaster.service';
import { SwalService } from 'src/app/admin/helper/services/swal.service';
import { ConfigurationService } from '../../configuration.service';
import { ISaveListDataModel } from '../IListModel';
import { constants } from 'src/app/admin/helper/constants';
import { SpinnerService } from 'src/app/admin/helper/services/spinner.service';

@Component({
  selector: 'app-list-data',
  templateUrl: './list-data.component.html',
  styleUrls: ['./list-data.component.scss']
})
export class ListDataComponent {

  lists: [];
  filters = {
    startDate: '',
    endDate: '',
    pageNo: '1',
    noOfPages: 10,
    searchArray: [
      {
        key: 'value',
        value: ''
      }
    ]
  };
  range: any;
  totalRecords = 0;
  listForm: FormGroup;
  isFormBinded = false;

  constructor(
    public dialogRef: MatDialogRef<ListDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, private configurationService: ConfigurationService,
    private toastr: ToasterService, private swalService: SwalService,
    private spinner: SpinnerService) {
    this.lists = this.data.listData;
    this.spinner.hide();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm(editDetails: ISaveListDataModel = null) {
    this.isFormBinded = false;
    this.listForm = this.fb.group({
      id: [editDetails ? (editDetails.id || null) : null],
      lookupId: [this.data.lookupId, Validators.compose([Validators.required])],
      value: [editDetails ? (editDetails.value || '') : '', Validators.compose([Validators.required])],
      display: [editDetails ? (editDetails.display || '1') : '1', Validators.compose([Validators.required])]
    });
    this.isFormBinded = true;
  }

  add() {
    this.createForm();
  }

  edit(selectedRecords: ISaveListDataModel) {
    this.createForm(selectedRecords);
  }

  async save() {
    if (this.listForm.valid) {
      try {
        this.spinner.showFull();
        const res = await this.configurationService.saveListData(this.listForm.value, this.data.lookupId);
        if (res) {
          this.toastr.success('success', constants.messages.LIST_DATA_SAVE_SUCCESS);
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
        const res = await this.configurationService.deleteListData(id, this.data.lookupId);
        if (res) {
          this.toastr.success('success', constants.messages.LIST_DATA_DELETE_SUCCESS);
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
      const res = await this.configurationService.getAllListDataById(this.data.lookupId);
      this.lists = res.data as [];
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

}
