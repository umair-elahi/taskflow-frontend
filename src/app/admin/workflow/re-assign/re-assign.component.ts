import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurationService } from '../../configuration/configuration.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { constants } from '../../helper/constants';

@Component({
  selector: 'app-re-assign',
  templateUrl: './re-assign.component.html',
  styleUrls: ['./re-assign.component.scss']
})
export class ReAssignComponent {

  isFormBinded: Boolean = false;
  userForm: FormGroup = null;
  users: any = [];
  constructor(private dialogRef: MatDialogRef<ReAssignComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder, private spinner: SpinnerService,
    private toastr: ToasterService,
    private configurationService: ConfigurationService) {
    this.init();
  }

  async init() {
    this.createForm();
    this.users = this.data.users.data;
  }

  createForm() {
    this.isFormBinded = false;
    this.userForm = this.fb.group({
      userId: [this.data.initiatorId, Validators.compose([Validators.required])]
    });
    this.isFormBinded = true;
    this.spinner.hide();
  }

  onNoClick(resData: any = null): void {
    this.dialogRef.close({
      appId: this.data.appId,
      executionId: this.data.executionId,
      workflowId: this.data.workflowId,
      userId: resData ? resData.userId : null
    });
  }

  send() {
    if (this.userForm.valid) {
      this.onNoClick(this.userForm.value);
    }
  }

}
