import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelPopupComponent } from './label-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LabelPopupComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  exports: [LabelPopupComponent] 
})
export class LabelPopupModule {}
