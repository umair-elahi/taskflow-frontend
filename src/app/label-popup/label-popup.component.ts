import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-label-popup',
  templateUrl: './label-popup.component.html',
  styleUrls: ['./label-popup.component.scss']
})
export class LabelPopupComponent {
  labelTitle: string = '';
  labelColor: string = '#000001'; // Default color

  constructor(
    public dialogRef: MatDialogRef<LabelPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  saveLabel(): void {
    const labelData = { title: this.labelTitle, color: this.labelColor };
    this.dialogRef.close(labelData);
  }

  
}
