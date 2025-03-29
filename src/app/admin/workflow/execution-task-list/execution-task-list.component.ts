import { Component, OnInit, Renderer2 } from '@angular/core';
import { ExecutionListService } from '../../helper/services/execution-list.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToasterService } from '../../helper/services/toaster.service';
import { SwalService } from '../../helper/services/swal.service';
import { WorkflowService } from '../workflow.service';
import { TitleService } from '../../helper/services/title.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { constants } from '../../helper/constants';
import { ConfigurationService } from '../../configuration/configuration.service';
import { ConfirmationCommentsModalComponent } from '../confirmation-comments-modal/confirmation-comments-modal.component';
import { ApplicationWorkflowType } from '../../helper/enum';
import { environment } from 'src/environments/environment';
import { MenuCountsService } from '../../helper/services/menu-counts.service';
import { FormGroup } from '@angular/forms';
import { FileUploadService } from '../../helper/services/file-upload.service';
import { IUserModel } from '../../configuration/user/IUserModel';
import { ReAssignComponent } from '../re-assign/re-assign.component';
import { UserService } from '../../helper/services/user.service';
import * as moment from 'moment';
import { LabelPopupComponent } from '../../../label-popup/label-popup.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import * as _ from 'lodash';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-execution-task-list',
  templateUrl: './execution-task-list.component.html',
  styleUrls: ['./execution-task-list.component.scss']
})
export class ExecutionListComponent implements OnInit {
  taskLabels: { title: string; color: string }[] = [];
  tempList: any = [];
  lists: any = [];
  totalTasks: number = 0;
  users: IUserModel[] = [];
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
  status = '';
  title = '';
  appId: string = null;
  searchText: String = '';
  currentUserId: any = null;
  applications: any = [];
  rptFilter: any = {
    applicationId: null,
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD')
  };
  searchByMulti = '';
  list: any;
  taskCount: number;

  // FILE RESTRICTION ADDITIONS START
  allowedExtensions = ["jpeg", "jpg", "webp", "csv", "xls", "xlsx", "xlsm", "ppt", "pptx", "pps", "doc", "docx", "pdf"];
  allowedMimeTypes = [
    'image/jpeg',
    'image/webp',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf'
  ];
  // FILE RESTRICTION ADDITIONS END

  applicationData: any
  selectedTab: string = 'application'; // Default selected tab

  constructor(
    private toastr: ToasterService,
    private swalService: SwalService,
    private titleService: TitleService,
    private router: Router,
    private workflowService: WorkflowService,
    private spinner: SpinnerService,
    private dialog: MatDialog,
    private configurationService: ConfigurationService,
    private fileUploadService: FileUploadService,
    private menuCountsService: MenuCountsService,
    private _activatedRoute: ActivatedRoute,
    private userService: UserService,
    private renderer: Renderer2,
    private executionListService: ExecutionListService
  ) {
    this.updateTotalTasks();
  }

  async ngOnInit() {
    if (this.router.url !== '/workflow/dashboard') {
      await this.setTitle();
    }

    const paramId = this._activatedRoute.snapshot.paramMap.get('appId');
    this.appId = paramId === 'all' ? null : paramId;
    this.currentUserId = this.userService.getUser().id;

    await this.getListData();

    this.lists = this.lists.map(list => ({
      ...list,
      read: list.read || false
    }));

    this.lists.forEach(list => {
      const storedLabels = this.loadLabelsFromLocalStorage(list.id);
      if (storedLabels) {
        list.labels = storedLabels;
      } else {
        list.labels = [];
      }

      list.read = this.loadReadStatusFromLocalStorage(list.id);
    });

    this.updateTotalTasks();
  }

  // Update totalTasks and set it in the service
  updateTotalTasks(): void {
    this.totalTasks = this.lists.length;
    // this.executionListService.updateTaskCount(this.totalTasks); // Update the service with the new task count
  }
  
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  

  async setTitle() {
    const splitArr = this.router.url.split('/');
    const url = '/' + splitArr[1] + '/' + splitArr[2];
    switch (url.toLowerCase()) {
      case '/workflow/approvals':
        this.status = ApplicationWorkflowType.APPROVAL;
        this.title = 'Approvals';
        this.titleService.setTitle('Workflow', this.title);
        break;
      case '/workflow/input-request':
        this.status = ApplicationWorkflowType.INPUT;
        this.title = 'Input Requests';
        this.titleService.setTitle('Workflow', this.title);
        break;
      case '/workflow/approved':
        this.status = constants.executionStatus.APPROVED;
        this.title = 'Approved';
        this.titleService.setTitle('Workflow', this.title);
        break;
      case '/workflow/rejected':
        this.status = constants.executionStatus.REJECT;
        this.title = 'Rejected';
        this.titleService.setTitle('Workflow', this.title);
        break;
      case '/workflow/draft':
        this.status = constants.executionStatus.DRAFT;
        this.title = 'Draft';
        this.titleService.setTitle('Workflow', this.title);
        break;
      case '/workflow/inprogress':
        this.status = constants.executionStatus.INPROGRESS;
        this.title = 'In Progress';
        this.titleService.setTitle('Workflow', this.title);
        break;
      case '/workflow/clarification':
        this.status = constants.executionStatus.CLARITY;
        this.title = 'Clarifications';
        this.titleService.setTitle('Workflow', this.title);
        break;
      case '/workflow/participated':
        this.status = constants.executionStatus.PARTICIPATED;
        this.title = 'Participated';
        this.titleService.setTitle('Workflow', this.title);
        break;
      case '/workflow/withdraw':
        this.status = constants.executionStatus.WITHDRAW;
        this.title = 'Withdraw';
        this.titleService.setTitle('Workflow', this.title);
        const apps = await this.workflowService.getApplications('', '', []);
        this.applications = apps.data;
        break;
      default:
        this.status = constants.executionStatus.APPROVED;
        this.title = 'Approved';
        this.titleService.setTitle('Workflow', this.title);
    }
  }

  async deleteRecord(id) {
    const { value: alertRes } = await this.swalService.deleteWarningPopup();
    if (alertRes) {
      try {
        this.spinner.showFull();
        const res = await this.workflowService.deleteExecutionById(id);
        if (res) {
          this.toastr.success('success', constants.messages.EXECUTION_DELETE_SUCCESS);
          await this.getListData();
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
        this.lists = []; 
  this.updateTotalTasks();
      this.spinner.showFull();
      let promise = null;
      switch (this.status) {
        case ApplicationWorkflowType.APPROVAL:
          promise = this.workflowService.getAllMyExecutions(constants.executionStatus.DRAFT, ApplicationWorkflowType.APPROVAL, this.appId);
          break;
        case ApplicationWorkflowType.INPUT:
          promise = this.workflowService.getAllMyExecutions(constants.executionStatus.DRAFT, ApplicationWorkflowType.INPUT, this.appId);
          break;
        case constants.executionStatus.DRAFT:
          promise = this.workflowService.getAllMyExecutions(constants.executionStatus.DRAFT, null, this.appId);
          break;
        case constants.executionStatus.INPROGRESS:
          promise = this.workflowService.getAllMyExecutions(constants.executionStatus.INPROGRESS, null, this.appId);
          break;
        case constants.executionStatus.PARTICIPATED:
          promise = this.workflowService.getMyParticipatedExecution();
          break;
        case constants.executionStatus.WITHDRAW:
          promise = this.workflowService.getMyWithdrawExecution(this.rptFilter);
          break;
        default:
          promise = this.workflowService.getAllMyExecutions(this.status, null, this.appId);
      }
      const res: any = await promise;
      this.tempList = res.data;
      this.totalRecords = res.data.length;
      this.range = _.range(Math.ceil(res.data.length / parseInt(this.filters.noOfPages.toString(), 0)));
      this.getPaginatedData();
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async searchParticipated() {
    try {
      this.spinner.showFull();
      //@ts-ignore
      const res: any = await this.workflowService.getMyParticipatedExecution(this.searchText);
      this.tempList = res.data;
      this.totalRecords = res.data.length;
      this.range = _.range(Math.ceil(res.data.length / parseInt(this.filters.noOfPages.toString(), 0)));
      this.getPaginatedData();
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async openAccordianItem(listObj) {
    
    try {
      listObj.read = true;
      this.spinner.showSpinner();
      if (!listObj.isDataLoaded) {
        const execData: any = await this.workflowService.getTransformExecutionById(listObj.id, this.status);
        listObj.applicationId = execData.data.applicationId;
        listObj.application = execData.data.application;
        listObj.applicationExecutionForms = execData.data.applicationExecutionForms;
        listObj.applicationExecutionWorkflows = execData.data.applicationExecutionWorkflows;
        listObj.latitude = execData.data.latitude;
        listObj.longitude = execData.data.longitude;

        // Aggregate comments from all workflows
        listObj.allComments = [];
        listObj.applicationExecutionWorkflows.forEach(workflow => {
          if (workflow.comments) {
            listObj.allComments = listObj.allComments.concat(workflow.comments);
          }
        });

        await this.parseData(listObj);
        listObj.isDataLoaded = true;
      }
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async parseData(listObj) {
    const formFields = {};
    this.applicationData = listObj.application;

    for (const ef of listObj.applicationExecutionForms) {
      formFields[ef.applicationFormFieldId] = ef.value;
      formFields[ef.applicationFormFieldId + '_id'] = ef.id;
    }
    for (const ele of listObj.application.applicationFormSections) {
      for (const field of ele.applicationFormFields) {
        field.applicationId = ele.applicationId;
        field.value = formFields[field.id] || '';

        let lookupDataValues: any = [];
        if (field.lookupId && field.templateName !== constants.lookupListTemplateName.DEPARTMENT) {
          lookupDataValues = await this.configurationService.getAllListDataById(field.lookupId);
        }
        if (field.templateName === constants.lookupListTemplateName.DROPDOWN) {
          lookupDataValues.data.map(data => data.id = data.id.toString());
          field.templateOptions.options = lookupDataValues.data;
          delete field.templateOptions.placeholder;
          field.templateOptions.valueProp = 'id';
          field.templateOptions.labelProp = 'value';
        } else if (field.templateName === constants.lookupListTemplateName.USERS) {
          const users = await this.configurationService.getallUsers();
          field.templateOptions.options = users.data;
          delete field.templateOptions.placeholder;
          field.templateOptions.valueProp = 'id';
          field.templateOptions.labelProp = 'firstName';
        } else if (field.lookupId && field.templateName === constants.lookupListTemplateName.DEPARTMENT) {
          const filteredUsers = await this.configurationService.getUserByDepartmentId(field.lookupId);
          field.templateOptions.options = filteredUsers.data;
          delete field.templateOptions.placeholder;
          field.templateOptions.valueProp = 'id';
          field.templateOptions.labelProp = 'firstName';
        } else if (field.templateName === constants.lookupListTemplateName.CHECKBOX) {
          field.templateOptions.options = [];
          for (const x of lookupDataValues.data) {
            field.templateOptions.options.push({
              value: x.value,
              key: x.id
            });
          }
          const arr = field.value.split(',');
          field.value = {};
          for (const a of arr) {
            field.value[a] = true;
          }
        } else if (field.templateName === constants.lookupListTemplateName.FILE) {
          field.type = 'file';
          delete field.templateOptions.maxLength;
          if (field.value) {
            field.templateOptions.required = false;
          }
          field.templateOptions.change = async (control, $event) => { await this.fileChange(control, $event); };
        } else if (field.templateName === constants.lookupListTemplateName.CHECKBOX) {
          field.templateOptions.options = [];
          for (const x of lookupDataValues.data) {
            field.templateOptions.options.push({
              value: x.value,
              key: x.id
            });
          }
          const arr = field.value.split(',');
          field.value = {};
          for (const a of arr) {
            field.value[a] = true;
          }
        } else if (field.templateName === constants.lookupListTemplateName.FILE) {
          delete field.templateOptions.maxLength;
          
          // Add accept attribute with MIME types
          field.templateOptions.accept = this.allowedMimeTypes.join(',');
          
          // Existing change handler
          field.templateOptions.change = async (control, $event) => { 
            await this.fileChange(control, $event); 
          };
        }
        field.className = 'col-md-4';
        if (field.permission === this.permissions.READONLY ||
          this.status === constants.executionStatus.DRAFT ||
          this.status === constants.executionStatus.APPROVED ||
          this.status === constants.executionStatus.REJECT ||
          this.status === constants.executionStatus.INPROGRESS ||
          this.status === constants.executionStatus.PARTICIPATED) {
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

  async getLookupDataValue(lookupDataId: number) {
    const res: any = await this.configurationService.getLookupDataById(lookupDataId);
    return res.data.value;
  }

  goToPage(pageNo) {
    this.filters.pageNo = pageNo;
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

  getPaginatedData(list: any = null) {
    if (this.filters.noOfPages.toString() !== '-1') {
      const x = (parseInt(this.filters.pageNo, 0) - 1) * this.filters.noOfPages;
      this.lists = _.take(_.drop(list || this.tempList, x), this.filters.noOfPages);
    } else {
      this.lists = this.tempList;
    }
  }

  async fileChange(field, eve) {
    try {
      const fileInput = eve.target; // Reference to the file input
      const f: File = eve.currentTarget.files[0];
      const firstFieldId = this.applicationData.applicationFormSections[0].applicationFormFields[0].id;
      const firstFieldInputName = this.applicationData.applicationFormSections[0].applicationFormFields[0].fieldId;
      const firstFieldFormValue = this.applicationData.applicationFormSections[0].formlyProp.templateOptionsForm.value[firstFieldInputName]
      
      // Validate file type
      if (!f) return;
      const fileExtension = f.name.split('.').pop().toLowerCase();
      if (!this.allowedExtensions.includes(fileExtension)) {
        this.toastr.error('Error', `Invalid file type. Allowed types: ${this.allowedExtensions.join(', ')}`);
        fileInput.value = ''; // Clear invalid selection
        return;
      }

      console.log('Request Payload:', {
        applicationId: field.applicationId,
        formFieldId: field.id,
        firstFieldId,
        firstFieldInputName,
        firstFieldFormValue
      });
  
      this.spinner.showFull();
      const res: any = await this.fileUploadService.postExecutionFile(f, {
        applicationId: field.applicationId,
        formFieldId: field.id,
        firstFieldId: firstFieldId,
        firstFieldInputName: firstFieldInputName,
        firstFieldFormValue: firstFieldFormValue
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
    this.spinner.showFull();
    const users = await this.workflowService.getExecutionParticipatedUsers(data.id);
    this.spinner.hide();
    const workflows = [{
      id: -1,
      name: 'Initiator'
    }];
    data.applicationExecutionWorkflows.forEach((aew) => {
      workflows.push({
        id: aew.applicationWorkflow.id,
        name: aew.applicationWorkflow.name,
      });
    });
    const draftExec = _.find(data.applicationExecutionWorkflows, { status: constants.executionStatus.DRAFT });
    const dialogRef = this.dialog.open(ConfirmationCommentsModalComponent, {
      width: '700px',
      data: {
        appId: data.application.id,
        executionId: data.id,
        workflowId: draftExec.id,
        status: constants.executionStatus.CLARITY,
        initiatorId: data.createdBy,
        users,
        workflows
      }
    }).afterClosed().toPromise().then(async (resp) => {
      if (resp && resp.data) {
        try {
          this.spinner.showFull();
          const res = await this.workflowService.saveApplicationExecutionWorkflow(resp.appId, resp.executionId,
            resp.workflowId, { status: resp.status, clarificationDetails: resp.data });
          if (res) {
            this.menuCountsService.refreshCounts();
            this.toastr.success('success', constants.messages.CLARITY_SUCCESS);
            // this.router.navigate(['/workflow', 'draft', 'all']);
            await this.getListData();
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
    const draftExec = _.find(data.applicationExecutionWorkflows, { status: constants.executionStatus.DRAFT });
    const dialogRef = this.dialog.open(ConfirmationCommentsModalComponent, {
      width: '700px',
      data: {
        appId: data.application.id,
        executionId: data.id,
        workflowId: draftExec.id,
        status: constants.executionStatus.REJECT,
        initiatorId: data.createdBy
      }
    }).afterClosed().toPromise().then(async (resp) => {
      if (resp && resp.data) {
        try {
          this.spinner.showFull();
          const res = await this.workflowService.saveApplicationExecutionWorkflow(resp.appId, resp.executionId,
            resp.workflowId, { status: resp.status, rejectionDetails: resp.data });
          if (res) {
            this.menuCountsService.refreshCounts();
            this.toastr.success('success', constants.messages.REJECT_SUCCESS);
            // this.router.navigate(['/workflow', 'draft', 'all']);
            await this.getListData();
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
      if (!this.isFormValid(data.application.applicationFormSections)) {
        return;
      }
      this.spinner.showFull();
      const draftExec = _.find(data.applicationExecutionWorkflows, { status: constants.executionStatus.DRAFT });
      await this.saveApplicationExecutionData(data.id, data.applicationId, data.application.applicationFormSections);
      const res = await this.workflowService.saveApplicationExecutionWorkflow(
        data.application.id,
        data.id,
        draftExec.id,
        { status: constants.executionStatus.APPROVED });
      if (res) {
        this.menuCountsService.refreshCounts();
        this.toastr.success('success', constants.messages.APPROVE_SUCCESS);
        await this.getListData();
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

  async sendForReassign(data: any) {
    this.spinner.showFull();
    const users = await this.configurationService.getUsers('', '', []);
    this.spinner.hide();
    const dialogRef = this.dialog.open(ReAssignComponent, {
      width: '700px',
      data: {
        appId: data.application.id,
        executionId: data.id,
        workflowId: data.applicationWorkflowId,
        users
      }
    }).afterClosed().toPromise().then(async (resp) => {
      if (resp && resp.userId) {
        try {
          this.spinner.showFull();
          const res = await this.workflowService.reAssign(resp);
          if (res) {
            this.menuCountsService.refreshCounts();
            this.toastr.success('success', constants.messages.REASSIGN_SUCCESS);
            // this.router.navigate(['/workflow', 'draft', 'all']);
            await this.getListData();
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

  async sendForWithdraw(data: any) {
    const { value: alertRes } = await this.swalService.warning('Confirm', 'Are you sure you want to withdraw this request?');
    if (alertRes) {
      try {
        this.spinner.showFull();
        const draftExec = _.find(data.applicationExecutionWorkflows, { status: constants.executionStatus.DRAFT });
        const res = await this.workflowService.withdraw(data.id, draftExec.id);
        if (res) {
          this.toastr.success('success', constants.messages.WITHDRAW_SUCCESS);
          await this.getListData();
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

  async saveApplicationExecutionData(id, applicationId, sections) {
    if (!this.isFormValid(sections)) {
      return;
    }
    const data: any = {
      id,
      applicationId,
      applicationExecutionForms: []
    };
    for (const ele of sections) {
      const frm = ele.formlyProp.templateOptionsForm as FormGroup;
      const keys = Object.keys(frm.value);
      for (const key of keys) {
        if (frm.controls[key].disabled) {
          continue;
        }
        const field = _.find(ele.applicationFormFields, { key: key });
        const frmVal = frm.value[key];
        let val = '';
        if (frmVal) {
          val = frmVal.toString();
        }
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
    }
    this.spinner.showFull();
    const res = await this.workflowService.saveWorkflowExecutionForm(applicationId, data);
    if (res) {
      this.toastr.success('success', constants.messages.EXECUTION_SAVE_SUCCESS);
    }
  }

  async saveExecution(execution: any) {
    try {
      if (!this.isFormValid(execution.application.applicationFormSections)) {
        return;
      }
      if (!this.newComment) {
        this.toastr.error('Comment', constants.messages.COMMENT_REQUIRED);
        return;
      }
      this.spinner.showFull();
      const executionWorkflow = _.find(execution.applicationExecutionWorkflows, { status: constants.executionStatus.CLARITY });
      if (!executionWorkflow.comments || !executionWorkflow.comments.length) {
        executionWorkflow.comments = [];
      }
      executionWorkflow.comments.push({ comment: this.newComment, time: new Date() });
      await this.saveApplicationExecutionData(execution.id, execution.applicationId, execution.application.applicationFormSections);
      const res: any = await this.workflowService.saveApplicationExecutionWorkflow(
        execution.applicationId,
        execution.id,
        executionWorkflow.id,
        { comments: executionWorkflow.comments, status: 'draft' }
      );
      if (res) {
        this.menuCountsService.refreshCounts();
        this.toastr.success('success', constants.messages.CLARITY_SUCCESS);
        await this.getListData();
      } else {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
      }
    } catch (ex) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  isFormValid(sections) {
    let validForm = true;
    if (this.status === constants.executionStatus.CLARITY || this.status === constants.workflowTypes.INPUT) {
      for (const ele of sections) {
        const frm = ele.formlyProp.templateOptionsForm as FormGroup;
        const keys = Object.keys(frm.value);
        for (const key of keys) {
          const field = frm.controls[key];
          if (!field.disabled) {
            if (!field.valid) {
              validForm = false;
            }
          }
        }
      }
    }
    if (!validForm) {
      this.toastr.error('Error', constants.messages.ALL_FIELDS_REQUIRED);
    }
    return validForm;
  }

  getLink(link: string) {
    return environment.downloadimage + link;
  }

  filterResultsByMultiFields() {
    let lst = this.tempList;
    if (this.searchByMulti) {
      lst = [];
      this.tempList.forEach((l) => {
        if (l.name && l.name.toLowerCase().includes(this.searchByMulti.toLowerCase())) {
          lst.push(l);
        } else if (l.title && l.title.toLowerCase().includes(this.searchByMulti.toLowerCase())) {
          lst.push(l);
        } else if (l.createdByName && l.createdByName.toLowerCase().includes(this.searchByMulti.toLowerCase())) {
          lst.push(l);
        }
      });
    }

    this.getPaginatedData(lst);
  }







  openLabelPopup(list: any) {
    const dialogRef = this.dialog.open(LabelPopupComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addLabelToTask(list, result.title, result.color);
      }
    });
  }
  
  

  addLabelToTask(task: any, title: string, color: string) {
    if (title.trim()) {
      // Ensure only one label is present by clearing any existing labels first
      task.labels = [{ title, color }];
  
      this.saveLabelsToLocalStorage(task.id, task.labels);
    } else {
      console.error('Label title is required');
    }
  }
  

  
saveLabelsToLocalStorage(taskId: string, labels: any[]) {
  localStorage.setItem(`task_labels_${taskId}`, JSON.stringify(labels));
}
  

deleteLabelFromTask(task: any, labelIndex: number) {
  // Remove the label at the specified index
  task.labels.splice(labelIndex, 1);

  // Save the updated labels back to local storage
  this.saveLabelsToLocalStorage(task.id, task.labels);
}


loadLabelsForTasks(tasks: any[]) {
  tasks.forEach(task => {
    const storedLabels = localStorage.getItem(`task_labels_${task.id}`);
    
    if (storedLabels) {
      task.labels = JSON.parse(storedLabels); 
    } else {
      task.labels = []; 
    }
  });
}

  getTextColor(bgColor: string): string {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? 'black' : 'white';
  }

  loadLabelsFromLocalStorage(taskId: string) {
    const storedLabels = localStorage.getItem(`task_labels_${taskId}`);
    return storedLabels ? JSON.parse(storedLabels) : null;
  }
  
  toggleReadStatus(list: any) {
    list.read = !list.read;
    this.saveReadStatusToLocalStorage();
  }
  
  saveReadStatusToLocalStorage() {
    const readStatus = this.lists.map(list => ({
      id: list.id,
      read: list.read
    }));
  
    // Save to localStorage
    localStorage.setItem('readStatus', JSON.stringify(readStatus));
  }

  loadReadStatusFromLocalStorage(listId: string): boolean {
    const storedReadStatus = localStorage.getItem('readStatus');
    if (!storedReadStatus) return false;  // Default to false if no status is found
    const readStatus = JSON.parse(storedReadStatus);
    const listStatus = readStatus.find(status => status.id === listId);
    return listStatus ? listStatus.read : false;
  }


}
