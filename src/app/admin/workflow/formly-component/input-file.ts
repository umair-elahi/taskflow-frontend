import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-formly-field-input',
    template: `
    <label>
    {{field.name}}
    <span *ngIf="field.templateOptions.required">*</span>
    </label><br />
    <button mat-icon-button [matMenuTriggerFor]="menu" style="height: 20px;width: 40%;text-align: center;margin-bottom: 15px;">
    <mat-icon style="margin: -12px;">attachment</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
        <button mat-menu-item *ngIf="!field.templateOptions.disabled" style="height: 60px;">
            <mat-icon>attach_file</mat-icon>
            <input *ngIf="!field.templateOptions.disabled" type="file" [formControl]="formControl" [formlyAttributes]="field">
        </button>
        <a href="{{getLink(filePath)}}" target="_blank">
            <button *ngIf="filePath" mat-menu-item style="height: 60px;">
                <mat-icon>cloud_download</mat-icon>
                <span>View File</span>
            </button>
        </a>
    </mat-menu>
 `,
})
export class FormlyFieldFileInputComponent extends FieldType {
    filePath: any = '';

    // tslint:disable-next-line: use-life-cycle-interface
    ngOnInit(): void {
        this.filePath = this.field.defaultValue;
        this.formControl.setValue('');
    }
    getLink(link: string) {
        return environment.downloadimage + link;
    }
}
