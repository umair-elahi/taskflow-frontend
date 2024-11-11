import { Component, OnInit } from '@angular/core';
import { ToasterService } from '../../helper/services/toaster.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SwalService } from '../../helper/services/swal.service';
import { WorkflowService } from '../workflow.service';
import { TitleService } from '../../helper/services/title.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { constants } from '../../helper/constants';
import * as _ from 'lodash';
import { ConfirmationCommentsModalComponent } from '../confirmation-comments-modal/confirmation-comments-modal.component';
import { ApplicationWorkflowType } from '../../helper/enum';
import { environment } from 'src/environments/environment';
import { ConfigurationService } from '../../configuration/configuration.service';
import { MenuCountsService } from '../../helper/services/menu-counts.service';
import { FileUploadService } from '../../helper/services/file-upload.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-request',
  templateUrl: './input-request.component.html',
  styleUrls: ['./input-request.component.scss']
})
export class InputRequestComponent implements OnInit {

  tempList: any = [];
  lists: any = [];
  filters = {
    startDate: '',
    endDate: '',
    pageNo: '1',
    noOfPages: 10,
    searchArray: [
      {
        key: 'status',
        value: ''
      }
    ]
  };
  range: any;
  totalRecords = 0;
  applicationId: any = null;
  sub: any = null;
  formFiles: any = {};
  permissions: any = constants.permissions;

  constructor(private toastr: ToasterService, private swalService: SwalService, private titleService: TitleService,
    private router: Router, private workflowService: WorkflowService, private spinner: SpinnerService, private dialog: MatDialog,
    private configurationService: ConfigurationService, private fileUploadService: FileUploadService,
    private menuCountsService: MenuCountsService) { }

  async ngOnInit() {
    if (this.router.url !== '/workflow/dashboard') {
      this.titleService.setTitle('Workflow', 'Input Requests');
    }
    await this.getListData();
  }

  async deleteRecord(id) {
    const { value: alertRes } = await this.swalService.deleteWarningPopup();
    if (alertRes) {
      try {
        this.spinner.showFull();
        const res = await this.workflowService.deleteExecutionById(id);
        if (res) {
          this.toastr.success('success', constants.messages.EXECUTION_DELETE_SUCCESS);
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
      const res: any = await this.workflowService.getMyExecutions(ApplicationWorkflowType.INPUT);
      // applicationExecutionWorkflows
      this.tempList = res.data;
      this.totalRecords = res.data.length;
      this.range = _.range(Math.ceil(res.data.length / parseInt(this.filters.noOfPages.toString(), 0)));
      await this.parseData();
      this.getPaginatedData();
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
  
    }
  }

  async parseData() {
    const formFields = {};
    for (const ex of this.tempList) {
      for (const ef of ex.applicationExecutionForms) {
        if (ef.value && ef.applicationFormField.templateName === constants.lookupListTemplateName.USERS) {
          const lookupData = await this.configurationService.getUserById(ef.value);
          ef.value = lookupData.data.firstName;
        } else if (ef.applicationFormField.templateOptions.type === 'select') {
          const lookupData = await this.configurationService.getLookupDataById(ef.value);
          ef.value = lookupData.data.value;
        }
        formFields[ef.applicationFormFieldId] = ef.value;
        formFields[ef.applicationFormFieldId + '_id'] = ef.id;
      }
      for (const ele of ex.application.applicationFormSections) {
        for (const field of ele.applicationFormFields) {
          field.applicationId = ele.applicationId;
          field.value = formFields[field.id] || '';

          let lookupDataValues: any = [];
            if (field.lookupId) {
              lookupDataValues = await this.configurationService.getAllListDataById(field.lookupId);
            }
            if (field.templateName === constants.lookupListTemplateName.DROPDOWN) {
              lookupDataValues.data.map(data => data.id = data.id.toString());
              field.templateOptions.options = lookupDataValues.data;
              delete field.templateOptions.placeholder;
              field.templateOptions.valueProp = 'id';
              field.templateOptions.labelProp = 'value';

              // converting select to input so that value shown if readOnly mode
              if (field.permission === this.permissions.READONLY) {
                field.type = 'input';
              }
            } else if (field.templateName === constants.lookupListTemplateName.USERS) {
              const users = await this.configurationService.getallUsers();
              field.templateOptions.options = users.data;
              delete field.templateOptions.placeholder;
              field.templateOptions.valueProp = 'id';
              field.templateOptions.labelProp = 'firstName';

              // converting select to input so that value shown if readOnly mode
              if (field.permission === this.permissions.READONLY) {
                field.type = 'input';
              }
            } else if (field.templateName === constants.lookupListTemplateName.CHECKBOX) {
              field.templateOptions.options = [];
              for (const x of lookupDataValues.data) {
                field.templateOptions.options.push({
                  value: x.value,
                  key: x.id
                });
              }
            } else if (field.templateName === constants.lookupListTemplateName.FILE) {
              field.type = 'file';
              delete field.templateOptions.maxLength;
              field.templateOptions.change = async (control, $event) => { await this.fileChange(control, $event); };
            }
            field.className = 'col-md-4';
            if (field.permission === this.permissions.READONLY) {
              field.className += ' disabled';
              field.templateOptions.disabled = true;
            }
            field.executionDataId = formFields[field.id + '_id'] || '';
            field.defaultValue = field.value;
        }
        ele.formlyProp = {
          templateOptionsForm: new FormGroup({}),
          options: {},
          fields: ele.applicationFormFields
        };
      }
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
      this.filters.noOfPages), this.filters.noOfPages);
  }

  async fileChange(field, eve) {
    try {
      this.spinner.showFull();
      const f: File = eve.currentTarget.files[0];
      const res: any = await this.fileUploadService.postExecutionFile(f, {
        applicationId: field.applicationId,
        formFieldId: field.id
      });
      if (res) {
        this.formFiles[field.id] = res.data.fileKey;
      }
    } catch (ex) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async sendForClarity(data: any) {
    const dialogRef = this.dialog.open(ConfirmationCommentsModalComponent, {
      width: '700px',
      data: {
        appId: data.application.id,
        executionId: data.id,
        workflowId: data.applicationExecutionWorkflows[0].id,
        status: constants.executionStatus.CLARITY,
        initiatorId: data.createdBy
      }
    }).afterClosed().toPromise().then(async (resp) => {
      if (resp.data) {
        try {
          this.spinner.showFull();
          await this.saveApplicationExecutionData(data.id, data.applicationId, data.application.applicationFormSections);
          const res = await this.workflowService.saveApplicationExecutionWorkflow(resp.appId, resp.executionId,
            resp.workflowId, { status: resp.status, clarificationDetails: resp.data });
          if (res) {
            this.menuCountsService.refreshCounts();
            this.toastr.success('success', constants.messages.CLARITY_SUCCESS);
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
    });
  }

  async sendForRejection(data: any) {
    const dialogRef = this.dialog.open(ConfirmationCommentsModalComponent, {
      width: '700px',
      data: {
        appId: data.application.id,
        executionId: data.id,
        workflowId: data.applicationExecutionWorkflows[0].id,
        status: constants.executionStatus.REJECT,
        initiatorId: data.createdBy
      }
    }).afterClosed().toPromise().then(async (resp) => {
      if (resp.data) {
        try {
          this.spinner.showFull();
          await this.saveApplicationExecutionData(data.id, data.applicationId, data.application.applicationFormSections);
          const res = await this.workflowService.saveApplicationExecutionWorkflow(resp.appId, resp.executionId,
            resp.workflowId, { status: resp.status, rejectionDetails: resp.data });
          if (res) {
            this.menuCountsService.refreshCounts();
            this.toastr.success('success', constants.messages.REJECT_SUCCESS);
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
    });
  }

  async sendForApproval(data: any) {
    try {
      this.spinner.showFull();
      await this.saveApplicationExecutionData(data.id, data.applicationId, data.application.applicationFormSections);
      const res = await this.workflowService.saveApplicationExecutionWorkflow(data.application.id, data.id,
        data.applicationExecutionWorkflows[0].id, { status: constants.executionStatus.APPROVED });
      if (res) {
        this.menuCountsService.refreshCounts();
        this.toastr.success('success', constants.messages.APPROVE_SUCCESS);
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

  async saveApplicationExecutionData(id, applicationId, sections) {
    const data: any = {
      id,
      applicationId,
      applicationExecutionForms: []
    };
    const isFormValid = true;
    for (const ele of sections) {
      const frm = ele.formlyProp.templateOptionsForm as FormGroup;
      // if (frm.valid) {
        const keys = Object.keys(frm.value);
        for (const key of keys) {
          if (frm.controls[key].disabled) {
            continue;
          }
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
      // } else {
      //   isFormValid = false;
      // }
    }

    if (isFormValid) {
      this.spinner.showFull();
      const res = await this.workflowService.saveWorkflowExecutionForm(applicationId, data);
      if (res) {
        this.toastr.success('success', constants.messages.EXECUTION_SAVE_SUCCESS);
        this.router.navigate(['/workflow', 'draft', 'all']);
      }
    } else {
      this.toastr.error('Error', constants.messages.ALL_FIELDS_REQUIRED);
    }
  }

  getLink(link: string) {
    return environment.downloadimage + link;
  }
}
