import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-workflow-modal',
  templateUrl: './all-workflow-modal.component.html',
  styleUrls: ['./all-workflow-modal.component.scss']
})
export class AllWorkflowModalComponent {

  public applications: any;
  constructor(private dialogRef: MatDialogRef<AllWorkflowModalComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
    private router: Router) {
    this.applications = data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initiateApp(appId: any) {
    this.router.navigate(['/workflow', appId, 'execute', 'new', 'open']);
    this.onNoClick();
  }

}
