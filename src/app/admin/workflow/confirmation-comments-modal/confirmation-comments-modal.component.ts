import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpinnerService } from '../../helper/services/spinner.service';
import { ToasterService } from '../../helper/services/toaster.service';

@Component({
  selector: 'app-confirmation-comments-modal',
  templateUrl: './confirmation-comments-modal.component.html',
  styleUrls: ['./confirmation-comments-modal.component.scss']
})
export class ConfirmationCommentsModalComponent {

  isFormBinded: Boolean = false;
  commentsForm: FormGroup = null;
  users: any = [];
  workflows: any = [];
  constructor(private dialogRef: MatDialogRef<ConfirmationCommentsModalComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder, private spinner: SpinnerService,
    private toastr: ToasterService) {
    this.init();
  }

  async init() {
    this.users = this.data.users ? this.data.users.data : [];
    this.workflows = this.data.workflows ? this.data.workflows : [];
    this.createForm();
  }

  createForm() {
    this.isFormBinded = false;
    this.commentsForm = this.fb.group({
      status: [this.data.status],
      userId: [this.data.initiatorId, Validators.compose([Validators.required])],
      comment: ['', Validators.compose([Validators.required])],
      workflowId: [this.users && this.users.length ? null : this.data.workflowId, Validators.compose([Validators.required])]
    });
    this.isFormBinded = true;
    this.spinner.hide();
  }

  onNoClick(resData: any = null): void {
    console.log('Sending comment data:', resData); // Log comment data
    this.dialogRef.close({
      appId: this.data.appId,
      executionId: this.data.executionId,
      workflowId: this.data.workflowId,
      status: this.data.status,
      data: resData
    });
  }
  

  send() {
    if (this.commentsForm.valid) {
      this.onNoClick(this.commentsForm.value);
    }
  }
}
