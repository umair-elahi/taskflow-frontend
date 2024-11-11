import { Component, OnInit } from '@angular/core';
import { ISaveListModel } from '../IListModel';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToasterService } from 'src/app/admin/helper/services/toaster.service';
import { SpinnerService } from 'src/app/admin/helper/services/spinner.service';
import { ConfigurationService } from '../../configuration.service';
import { constants } from 'src/app/admin/helper/constants';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-list',
  templateUrl: './add-new-list.component.html',
  styleUrls: ['./add-new-list.component.scss']
})
export class AddNewListComponent {

  listForm: FormGroup;
  public isFormBinded: Boolean = false;
  constructor(public dialogRef: MatDialogRef<AddNewListComponent>, private fb: FormBuilder,
    private configurationService: ConfigurationService, private toastr: ToasterService,
    private spinner: SpinnerService) {
    this.createForm();
  }

  createForm(editDetails: ISaveListModel = null) {
    this.listForm = this.fb.group({
      id: [editDetails ? (editDetails.id || null) : null],
      name: [editDetails ? (editDetails.name || '') : '', Validators.compose([Validators.required])],
      type: [editDetails ? (editDetails.type || '') : '', Validators.compose([Validators.required])]
    });
    this.isFormBinded = true;
  }

  onNoClick(isSave = false): void {
    this.dialogRef.close(isSave);
  }

  async save() {
    if (this.listForm.valid) {
      try {
        this.spinner.showFull();
        const res = await this.configurationService.saveList(this.listForm.value);
        if (res) {
          this.onNoClick(true);
          this.toastr.success('success', constants.messages.LIST_SAVE_SUCCESS);
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
}
