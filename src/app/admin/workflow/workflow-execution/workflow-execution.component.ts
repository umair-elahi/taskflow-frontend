import { Component, OnInit } from '@angular/core';
import { IListModel } from '../../configuration/list/IListModel';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { WorkflowService } from '../workflow.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleService } from '../../helper/services/title.service';
import { UserService } from '../../helper/services/user.service';
import { SwalService } from '../../helper/services/swal.service';
import { constants } from '../../helper/constants';
import { ConfigurationService } from '../../configuration/configuration.service';
import * as _ from 'lodash';
import { SpinnerService } from '../../helper/services/spinner.service';
import { FileUploadService } from '../../helper/services/file-upload.service';
import { environment } from 'src/environments/environment';
import { MenuCountsService } from '../../helper/services/menu-counts.service';
import { IUserModel } from '../../configuration/user/IUserModel';

@Component({
  selector: 'app-workflow-execution',
  templateUrl: './workflow-execution.component.html',
  styleUrls: ['./workflow-execution.component.scss']
})
export class WorkflowExecutionComponent implements OnInit {

  public isFormBinded: Boolean = false;
  lookupData: IListModel[];
  users: IUserModel[];
  applicationId: any = null;
  executionId: any = 'new';
  applicationDetails: any = null;
  applicationFormSection = null;
  editDetails: any = null;
  formFiles: any = {};
  downloadButtons: any = [];
  coords: any = {};
  state: String = 'open';

  constructor(private fb: FormBuilder, private workflowService: WorkflowService, private toastr: ToasterService,
    private swalService: SwalService, private titleService: TitleService, private _ActivatedRoute: ActivatedRoute,
    private router: Router, private userService: UserService, private configurationService: ConfigurationService,
    private spinner: SpinnerService, private fileUploadService: FileUploadService, private menuCountsService: MenuCountsService) { }

  async ngOnInit() {
    this.lookupData = this._ActivatedRoute.snapshot.data['data'].lists;
    this.applicationId = this._ActivatedRoute.snapshot.paramMap.get('appId');
    this.executionId = this._ActivatedRoute.snapshot.paramMap.get('id');
    this.state = this._ActivatedRoute.snapshot.paramMap.get('state');
    this.getLocation();
    if (this.executionId !== 'new') {
      await this.getExecutionDetails();
    }
    await this.getApplication();
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition((r) => {
      this.coords = r.coords;
    }, async () => {
      const res = await this.swalService.warningWithoutCancel('Location Required!',
        'Workflow required your location. Please enable your location and click ok');
      if (res) {
        this.getLocation();
      }
    });
  }

  async getExecutionDetails() {
    try {
      const res: any = await this.workflowService.getExecutionsById(this.executionId);
      this.editDetails = res.data;
    } catch (ex) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
    }
  }

  async getApplication() {
    try {
      const res = await this.workflowService.getApplicationById(this.applicationId);
      if (res) {
        this.applicationDetails = res.data || {};
        this.titleService.setTitle(this.applicationDetails.name, this.applicationDetails.shortDescription);
        await this.getApplicationFormDetails();
      } else {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
      }
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async getApplicationFormDetails() {
    try {
      this.spinner.showFull();
      const res = await this.workflowService.getApplicationForm(this.applicationId, this.state !== 'read');
      if (res) {
        this.applicationFormSection = res.data || [];
        for (const ele of this.applicationFormSection) {
          for (const f of ele.applicationFormFields) {
            let lookupDataValues: any = [];
            if (f.lookupId && f.templateName !== constants.lookupListTemplateName.DEPARTMENT) {
              lookupDataValues = await this.configurationService.getAllListDataById(f.lookupId);
            }
            if (f.templateName === constants.lookupListTemplateName.DROPDOWN) {
              lookupDataValues.data.map(data => data.id = data.id.toString());
              f.templateOptions.options = lookupDataValues.data;
              delete f.templateOptions.placeholder;
              f.templateOptions.valueProp = 'id';
              f.templateOptions.labelProp = 'value';
            }
            if (f.templateName === constants.lookupListTemplateName.USERS) {
              const users = await this.configurationService.getallUsers();
              f.templateOptions.options = users.data;
              delete f.templateOptions.placeholder;
              f.templateOptions.valueProp = 'id';
              f.templateOptions.labelProp = 'firstName';
            }
            if (f.templateName === constants.lookupListTemplateName.DEPARTMENT) {
              const users = await this.configurationService.getUserByDepartmentId(f.lookupId);
              f.templateOptions.options = users.data;
              delete f.templateOptions.placeholder;
              f.templateOptions.valueProp = 'id';
              f.templateOptions.labelProp = 'firstName';
            }
            if (f.templateName === constants.lookupListTemplateName.CHECKBOX) {
              f.templateOptions.options = [];
              for (const x of lookupDataValues.data) {
                f.templateOptions.options.push({
                  value: x.value,
                  key: x.id
                });
              }
            }
            if (f.templateName === constants.lookupListTemplateName.FILE) {
              delete f.templateOptions.maxLength;
              f.templateOptions.change = async (field, $event) => { await this.fileChange(field, $event); };
            }
          }
          ele.formlyProp = {
            templateOptionsForm: new FormGroup({}),
            options: {},
            fields: ele.applicationFormFields
          };
        }
        if (this.editDetails) {
          await this.setEditDetails();
        }
        this.isFormBinded = true;
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

  async setEditDetails() {
    for (const ele of this.applicationFormSection) {
      for (const f of ele.applicationFormFields) {
        if (this.editDetails) {
          const fieldData = _.find(this.editDetails.applicationExecutionForms, { applicationFormFieldId: f.id });
          if (fieldData) {
            if (f.templateName === constants.lookupListTemplateName.CHECKBOX) {
              const arr = fieldData.value.split(',');
              fieldData.value = {};
              for (const a of arr) {
                fieldData.value[a] = true;
              }
            }
            if (f.templateName === constants.lookupListTemplateName.FILE) {
              this.downloadButtons.push({
                id: f.id,
                name: f.name,
                link: environment.downloadimage + fieldData.value
              });
              this.formFiles[f.id] = fieldData.value;
              f.templateOptions.required = false;
            }
            f.executionDataId = fieldData.id;
            f.defaultValue = fieldData.value;
          }
        }
        if (this.state === 'read') {
          f.templateOptions.disabled = true;
        }
      }
      ele.formlyProp = {
        templateOptionsForm: new FormGroup({}),
        options: {},
        fields: ele.applicationFormFields
      };
    }
    this.spinner.hide();
  }

  async saveApplicationExecutionData(isPublish: Boolean = false) {
    try {
      const data: any = {
        applicationId: this.applicationId,
        applicationExecutionForms: []
      };
      if (this.executionId !== 'new') {
        data.id = this.executionId;
      } else {
        data.latitude = this.coords.latitude;
        data.longitude = this.coords.longitude;
      }
      let isFormValid = true;
      for (const ele of this.applicationFormSection) {
        const frm = ele.formlyProp.templateOptionsForm as FormGroup;
        if (frm.valid) {
          const keys = Object.keys(frm.value);
          for (const key of keys) {
            const field = _.find(ele.applicationFormFields, { key: key });
            let val = frm.value[key].toString();
            if (field.type === 'multicheckbox') {
              const strObj = [];
              const frmValueKeys = Object.keys(frm.value[key]);
              for (const c of frmValueKeys) {
                if (frm.value[key][c]) {
                  strObj.push(c);
                }
              }
              val = strObj.join(',');
            }
            if (this.formFiles[field.id]) {
              val = this.formFiles[field.id];
            }
            const x: any = {
              applicationFormFieldId: field.id,
              value: val,
              fieldId: field.fieldId
            };
            if (field.executionDataId) {
              x.id = field.executionDataId;
            }
            data.applicationExecutionForms.push(x);
          }
        } else {
          isFormValid = false;
        }
      }

      if (isFormValid) {
        this.spinner.showFull();
        const res: any = await this.workflowService.saveWorkflowExecution(this.applicationId, data);
        this.executionId = res.data.id;
        if (isPublish) {
          await this.publish();
        }

        if (res) {
          this.toastr.success('success', constants.messages.EXECUTION_SAVE_SUCCESS);
          this.router.navigate(['/workflow', 'list']);
        }
      } else {
        this.toastr.error('Error', constants.messages.ALL_FIELDS_REQUIRED);
      }
    } catch (ex) {
      this.toastr.error('Error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async fileChange(field, eve) {
    try {
      this.spinner.showFull();
      const f: File = eve.currentTarget.files[0];
      const res: any = await this.fileUploadService.postExecutionFile(f, {
        applicationId: this.applicationId,
        formFieldId: field.id
      });
      if (res) {
        this.formFiles[field.id] = res.data.fileKey;
        _.remove(this.downloadButtons, { id: field.id });
        this.downloadButtons.push({
          id: field.id,
          name: field.name,
          link: environment.downloadimage + res.data.fileKey
        });
      }
    } catch (ex) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async publishExecution() {
    try {
      const { value: alertRes } = await this.swalService.warning(`Publish ${this.applicationDetails.name}`,
        constants.messages.PUBLISH_EXECUTION_WARNING);
      if (!alertRes) {
        return;
      }
      this.spinner.showFull();
      await this.publish();
    } catch (ex) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async publish() {
    const res: any = await this.workflowService.publishExecution(this.applicationDetails.id, this.executionId);
    if (res && res.data) {
      this.router.navigate(['/workflow', 'list']);
      this.menuCountsService.refreshCounts();
      this.toastr.success('success', constants.messages.PUBLISH_SUCCESS);
    } else {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    }
  }
}
