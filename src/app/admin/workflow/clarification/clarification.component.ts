import { Component, OnInit } from '@angular/core';
import { ToasterService } from '../../helper/services/toaster.service';
import { Router } from '@angular/router';
import { SwalService } from '../../helper/services/swal.service';
import { WorkflowService } from '../workflow.service';
import { TitleService } from '../../helper/services/title.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { constants } from '../../helper/constants';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { ConfigurationService } from '../../configuration/configuration.service';
import { FormGroup } from '@angular/forms';
import { FileUploadService } from '../../helper/services/file-upload.service';
import { MenuCountsService } from '../../helper/services/menu-counts.service';

@Component({
  selector: 'app-clarification',
  templateUrl: './clarification.component.html',
  styleUrls: ['./clarification.component.scss']
})
export class ClarificationComponent implements OnInit {

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
  newComment = '';
  permissions: any = constants.permissions;

  constructor(private toastr: ToasterService, private swalService: SwalService, private titleService: TitleService,
    private router: Router, private workflowService: WorkflowService, private spinner: SpinnerService,
    private fileUploadService: FileUploadService,
    private configurationService: ConfigurationService,
    private menuCountsService: MenuCountsService) { }

  async ngOnInit() {
    if (this.router.url !== '/workflow/dashboard') {
      this.titleService.setTitle('Workflow', 'Clarifications');
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
      const res: any = await this.workflowService.getExecutionByStatus(constants.executionStatus.CLARITY);
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

  getLink(link: string) {
    return environment.downloadimage + link;
  }

  async saveExecution(execution: any) {
    try {
      if (!this.newComment) {
        this.toastr.error('Comment', constants.messages.COMMENT_REQUIRED);
        return;
      }
      this.spinner.showFull();
      const executionWorkflow = execution.applicationExecutionWorkflows[0];
      if (!executionWorkflow.comments || !executionWorkflow.comments.length) {
        executionWorkflow.comments = [];
      }
      executionWorkflow.comments.push({ comment: this.newComment, time: new Date() });
      const res: any = await this.workflowService.saveApplicationExecutionWorkflow(
        execution.applicationId,
        execution.id,
        executionWorkflow.id,
        { comments: executionWorkflow.comments, status: 'draft' }
      );
      if (res) {
        this.menuCountsService.refreshCounts();
        this.toastr.success('success', constants.messages.CLARITY_SUCCESS);
        this.getListData();
      } else {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
      }
    } catch (ex) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }
}
