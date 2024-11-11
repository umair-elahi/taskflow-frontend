import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, copyArrayItem } from '@angular/cdk/drag-drop';

import { ToasterService } from '../../helper/services/toaster.service';
import { SwalService } from '../../helper/services/swal.service';
import { TitleService } from '../../helper/services/title.service';
import { constants } from '../../helper/constants';
import { IBasicFields, IWorkflowFields, IApplicationWorkflow, IApplicationWorkflowFieldPermission } from './IWorkflowCreate';
import * as _ from 'lodash';
import { WorkflowService } from '../workflow.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IListModel } from '../../configuration/list/IListModel';
import { IUserModel } from '../../configuration/user/IUserModel';
import { UserService } from '../../helper/services/user.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { AddNewListComponent } from '../../configuration/list/add-new-list/add-new-list.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationService } from '../../configuration/configuration.service';
import { ApplicationWorkflowAssignTo } from '../../helper/enum';
import { IDepartmentModel } from './../../configuration/department/IDepartmentModel';
import { IGroupModel } from '../../configuration/groups/IGroupModel';

@Component({
  selector: 'app-create-workflow',
  templateUrl: './create-workflow.component.html',
  styleUrls: ['./create-workflow.component.scss']
})
export class CreateWorkflowComponent implements OnInit {

  //omer
  items: any[] = [];

  basicFields = constants.basicFields as IBasicFields[];
  even = [10];
  applicationForm: FormGroup;
  applicationSectionFrom: FormArray;
  isFormBinded = false;
  lookupData: IListModel[];
  userList: IUserModel[];
  departmentList: IDepartmentModel[];
  groupList: IGroupModel[];
  editDetails: any = null;
  applicationFromDetails: any = null;
  editRecordId = 'new';
  workflows: IApplicationWorkflow[] = [];
  permissionsList: IApplicationWorkflowFieldPermission[] = [];
  formFieldsTitles: any = [];
  selectedPermissionFlow: any = {
    type: 'new',
    workflowId: null
  };
  permissionTypes: any = constants.permissionTypes;
  workflowTypes: any = constants.workflowTypes;
  permissions: any = constants.permissions;
  assignTo = ApplicationWorkflowAssignTo;
  public appInitiator: any = {
    isEditModeWorkflowInitior: false,
    canAllUserInitiateApp: true,
    userIds: [],
    canAllUserEditApp: true,
    editableUserIds: []
  };
  showFormFieldTitlesSelect: Boolean = false;
  userFields = [];
  lastTimeoutId = null;
  private sub: any;
  constructor(private fb: FormBuilder, private workflowService: WorkflowService, private toastr: ToasterService,
    private swalService: SwalService, private titleService: TitleService, private _ActivatedRoute: ActivatedRoute,
    private router: Router, private userService: UserService, private spinner: SpinnerService, private dialog: MatDialog,
    private configurationService: ConfigurationService) { }

  async ngOnInit() {
    this.titleService.setTitle('Workflow', 'Create');
    this.lookupData = this._ActivatedRoute.snapshot.data['data'].lists;
    this.lookupData.splice(0, 0, {
      id: -1,
      name: 'Add New List',
      type: 'NEW'
    });
    this.userList = this._ActivatedRoute.snapshot.data['data'].users;
    this.departmentList = this._ActivatedRoute.snapshot.data['data'].departments;
    this.groupList = this._ActivatedRoute.snapshot.data['data'].groups;
    this.editRecordId = this._ActivatedRoute.snapshot.paramMap.get('id');
    if (this.editRecordId && this.editRecordId !== 'new') {
      this.titleService.setTitle('Workflow', 'Update');
      await this.getEditRecordDetails();
    } else {
      this.createForm();
    }
  }

  createForm() {
    this.isFormBinded = false;
    this.applicationForm = this.fb.group({
      id: [this.editDetails ? (this.editDetails.id || null) : null],
      name: [this.editDetails ? (this.editDetails.name || '') : '', Validators.compose([Validators.required])],
      shortDescription: [this.editDetails ? (this.editDetails.shortDescription || '') : '', Validators.compose([Validators.required])],
      userIds: [this.editDetails ? (this.editDetails.userIds || null) : null],
      canAllStart: [this.editDetails ? (this.editDetails.canAllStart || false) : false],
      canAllEdits: [this.editDetails ? (this.editDetails.canAllEdits || false) : false],
      editableUserIds: [this.editDetails ? (this.editDetails.editableUserIds || null) : null],
      subject: [this.editDetails ? (this.editDetails.subject || '') : ''],
    });
    if (this.editDetails) {
      this.appInitiator.canAllUserInitiateApp = this.editDetails.canAllStart || false;
      this.appInitiator.userIds = this.editDetails.userIds ? this.editDetails.userIds.split(',') : [];
      this.appInitiator.canAllUserEditApp = this.editDetails.canAllEdits || false;
      this.appInitiator.editableUserIds = this.editDetails.editableUserIds ? this.editDetails.editableUserIds.split(',') : [];
      this.appInitiator.subject = this.editDetails.subject;
    }
    this.createApplicationSectionForm();
    this.isFormBinded = true;
    this.spinner.hide();
  }

  //#region Section Form Management

  createApplicationSectionForm(formEditDetails: any = null, isNew: boolean = false) {
    if (!this.applicationSectionFrom) {
      this.applicationSectionFrom = this.fb.array([]);
    }
    this.applicationSectionFrom.push(this.createEmptyApplicationSectionForm(formEditDetails));
    if (isNew) {
      this.saveApplicationForm();
    }
  }

  createEmptyApplicationSectionForm(formEditDetails: any = null) {
    const fg = this.fb.group({
      id: [formEditDetails ? formEditDetails.id : null],
      name: [formEditDetails ? formEditDetails.name : 'Untitled Section', Validators.compose([Validators.required])],
      helpText: [formEditDetails ? formEditDetails.helpText : 'Untitled Help'],
      type: [formEditDetails ? formEditDetails.type : 'section', Validators.compose([Validators.required])],
      order: [formEditDetails ? formEditDetails.order : this.applicationSectionFrom.length + 1, Validators.compose([Validators.required])],
      isActive: [true],
      applicationSectionFormFields: [[]]
    });
    if (formEditDetails) {
      formEditDetails.applicationFormFields.forEach((x) => {
        const tempFields = _.cloneDeep(constants.templateOptions[x.templateName]);
        if (x.templateName === constants.lookupListTemplateName.DROPDOWN) {
          tempFields[5].templateOptions.options = this.lookupData;
          tempFields[5].templateOptions.change = (field, $event) => { this.selectChangeEvent(field, $event); };
        }
        if (x.templateName === constants.lookupListTemplateName.CHECKBOX) {
          tempFields[4].templateOptions.options = this.lookupData;
          tempFields[4].templateOptions.change = (field, $event) => { this.selectChangeEvent(field, $event); };
        }
        if (x.templateName === constants.lookupListTemplateName.DEPARTMENT) {
          tempFields[0].templateOptions.options = this.departmentList;
          tempFields[0].templateOptions.change = (field, $event) => { this.selectChangeEvent(field, $event); };
        }
        const d: any = {
          formlyProp: {
            templateOptionsForm: new FormGroup({}),
            options: {},
            fields: tempFields
          }
        };
        const tmpOpt = _.cloneDeep(constants.templateOptions[x.templateName]);
        d.templateOptions = {
          id: x.id,
          applicationFormSectionId: x.id,
          type: x.type,
          templateName: x.templateName,
          templateOptionType: x.templateOptions.type,
          icon: x.icon,
          isActive: x.isActive,
          options: x.templateOptions.options,
          isUser: x.templateOptions.isUser
        };
        tmpOpt.forEach((to) => {
          if (x.hasOwnProperty(to.key)) {
            d.templateOptions[to.key] = x[to.key];
          } else if (x.templateOptions.hasOwnProperty(to.key)) {
            d.templateOptions[to.key] = x.templateOptions[to.key];
          }
        });
        if (x.templateOptions.isUser) {
          this.userFields.push({
            id: x.fieldId,
            name: x.name
          });
        }
        fg.value.applicationSectionFormFields.push(d);
      });
    }
    return fg;
  }

  async removeApplicationSectionForm(index: number) {
    const { value: alertRes } = await this.swalService.deleteWarningPopup();
    if (alertRes) {
      this.applicationSectionFrom.value[index].isActive = false;
      await this.saveApplicationForm();
      const arr = this.applicationSectionFrom;
      arr.removeAt(index);
      if (arr.length <= 0) {
        this.createApplicationSectionForm();
      }
    }
  }

  async removeField(index: number, arr: any) {
    const { value: alertRes } = await this.swalService.deleteWarningPopup();
    if (alertRes) {
      arr[index].templateOptions.isActive = false;
      await this.saveApplicationForm();
      arr.splice(index, 1);
    }
  }

  async addEmptyWorkflow(workflowType: string) {
    const wf: IApplicationWorkflow = {
      id: null,
      name: 'Untitled ' + workflowType + ' Task',
      applicationId: this.applicationForm.controls['id'].value,
      type: workflowType,
      showMap: true,
      canWithdraw: true,
      userIds: [this.userService.getUser().id],
      order: this.workflows.length + 1,
      stepId: null,
      assignTo: null,
      showAssignToOption: false
    };
    this.workflows.push(wf);
    await this.saveWorkflows(false, workflowType);
  }

  async removeWorkflow(index: number) {
    const { value: alertRes } = await this.swalService.deleteWarningPopup();
    if (alertRes) {
      this.workflows[index]['isActive'] = false;
      await this.saveWorkflows(true);
      this.workflows.splice(index, 1);
    }
  }

  makeInitiaorWorkflowEditable() {
    this.appInitiator.isEditModeWorkflowInitior = !this.appInitiator.isEditModeWorkflowInitior;
    if (!this.appInitiator.isEditModeWorkflowInitior) {
      const userIds: any = this.applicationForm.controls['userIds'].value;
      this.appInitiator.userIds = userIds ? userIds.split(',') : [];
    }
  }

  activeButton(ind) {
    document.getElementById('circularMenu_' + ind).classList.toggle('active');
  }

  selectPermissions(pt, workflowId) {
    this.selectedPermissionFlow = {
      type: pt,
      workflowId: workflowId
    };

    this.checkCurrentPermission();
  }

  addPermissionIfNotExistsInArray(sectionId, fieldId, workflowId = null, wfType = null) {
    let item = null;
    let q: any = null;
    if (fieldId) {
      q = { applicationFormFieldId: fieldId };
      if (workflowId) {
        q.applicationWorkflowId = workflowId;
      }
    } else if (sectionId) {
      q = { applicationFormSectionId: sectionId };
      if (workflowId) {
        q.applicationWorkflowId = workflowId;
      }
    }
    item = _.find(this.permissionsList, q);
    if (!item) {
      if (workflowId) {
        this.permissionsList.push({
          type: this.permissionTypes.WORKFLOW,
          applicationFormSectionId: sectionId,
          applicationFormFieldId: fieldId,
          applicationId: this.applicationForm.controls['id'].value,
          applicationWorkflowId: workflowId,
          permission: wfType === this.workflowTypes.INPUT ? this.permissions.EDITABLE : this.permissions.READONLY
        });
      } else {
        this.permissionsList.push({
          type: this.permissionTypes.NEW,
          applicationFormSectionId: sectionId,
          applicationFormFieldId: fieldId,
          permission: this.permissions.EDITABLE,
          applicationId: this.applicationForm.controls['id'].value,
        });

        this.permissionsList.push({
          type: this.permissionTypes.INITIATOR_SUMMARY,
          applicationFormSectionId: sectionId,
          applicationFormFieldId: fieldId,
          permission: this.permissions.READONLY,
          applicationId: this.applicationForm.controls['id'].value,
        });

        this.permissionsList.push({
          type: this.permissionTypes.ALL_TASK,
          applicationFormSectionId: sectionId,
          applicationFormFieldId: fieldId,
          permission: this.permissions.VISIBLE,
          applicationId: this.applicationForm.controls['id'].value,
        });

        this.workflows.forEach((wf) => {
          if (wf.type === this.workflowTypes.INPUT || wf.type === this.workflowTypes.APPROVAL) {
            this.permissionsList.push({
              type: this.permissionTypes.WORKFLOW,
              applicationFormSectionId: sectionId,
              applicationFormFieldId: fieldId,
              applicationId: this.applicationForm.controls['id'].value,
              applicationWorkflowId: wf.id,
              permission: wf.type === this.workflowTypes.INPUT ? this.permissions.EDITABLE : this.permissions.READONLY
            });
          }
        });
      }
    }
  }

  async checkCurrentPermission() {
    await this.applicationSectionFrom.value.forEach(async ele => {
      const q = {
        applicationFormSectionId: ele.id,
        applicationFormFieldId: null,
        type: this.selectedPermissionFlow.type,
        applicationWorkflowId: null
      };
      if (this.selectedPermissionFlow.workflowId) {
        q.applicationWorkflowId = this.selectedPermissionFlow.workflowId;
      }
      const item = _.find(this.permissionsList, q);
      ele.perm = item ? item.permission : '';
      await ele.applicationSectionFormFields.forEach(field => {
        const x = { applicationFormFieldId: field.templateOptions.id, type: this.selectedPermissionFlow.type, applicationWorkflowId: null };
        if (this.selectedPermissionFlow.workflowId) {
          x.applicationWorkflowId = this.selectedPermissionFlow.workflowId;
        }
        const fieldItem = _.find(this.permissionsList, x);
        field.templateOptions.perm = fieldItem ? fieldItem.permission : '';
      });
    });
  }

  findFieldAndUpdatePermission(sectionId, fieldId, perm, section?) {
    // let item = null;
    // let q: any = null;
    if (fieldId) {
      const workflowFieldPermission = this.permissionsList.find(per =>
        per.applicationFormFieldId === fieldId
        && per.applicationWorkflowId === (this.selectedPermissionFlow.workflowId || null)
        && per.type === this.selectedPermissionFlow.type);
      if (workflowFieldPermission) {
        workflowFieldPermission.permission = perm;
      }
      // q = { applicationFormFieldId: fieldId, type: this.selectedPermissionFlow.type, applicationWorkflowId: null };
      // if (this.selectedPermissionFlow.workflowId) {
      //   q.applicationWorkflowId = this.selectedPermissionFlow.workflowId;
      // }
    } else if (sectionId) {
      const workflowFieldPermissions = this.permissionsList.filter(per =>
        per.applicationFormSectionId === sectionId
        && per.applicationWorkflowId === (this.selectedPermissionFlow.workflowId || null)
        && per.type === this.selectedPermissionFlow.type);
      if (workflowFieldPermissions && workflowFieldPermissions.length) {
        workflowFieldPermissions.forEach(field => {
          field.permission = perm;
        });
      }
      // q = {
      //   applicationFormSectionId: sectionId,
      //   applicationWorkflowId: null,
      //   type: this.selectedPermissionFlow.type,
      //   applicationFormFieldId: null,
      // };
      // if (this.selectedPermissionFlow.workflowId) {
      //   q.applicationWorkflowId = this.selectedPermissionFlow.workflowId;
      // }
    }
    // item = _.find(this.permissionsList, q);
    // if (item) {
    //   item.permission = perm;
    // }

    this.checkCurrentPermission();
    this.savePermissions();
  }

  toggleAssignToOption(workflow) {
    workflow.showAssignToOption = !workflow.showAssignToOption;
    if (!workflow.showAssignToOption) {
      workflow.assignTo = null;
      this.saveWorkflows();
    }
  }

  selectFormFieldForSubject(id) {
    this.appInitiator.subject = this.appInitiator.subject + id + '}';
    this.showFormFieldTitlesSelect = false;
  }

  changeFieldSubject() {
    this.showFormFieldTitlesSelect = this.appInitiator.subject.match('.*\{$');
  }
  //#endregion

  //#region API Calls
  async saveApplication() {
    if (this.applicationForm.valid) {
      try {
        const userIds = this.appInitiator.canAllUserInitiateApp ? '' : this.appInitiator.userIds.join(',');
        const editableUserIds = this.appInitiator.canAllUserEditApp ? '' : this.appInitiator.editableUserIds.join(',');
        this.applicationForm.controls['userIds'].setValue(userIds);
        this.applicationForm.controls['canAllStart'].setValue(this.appInitiator.canAllUserInitiateApp);
        this.applicationForm.controls['editableUserIds'].setValue(editableUserIds);
        this.applicationForm.controls['canAllEdits'].setValue(this.appInitiator.canAllUserEditApp);
        this.applicationForm.controls['subject'].setValue(this.appInitiator.subject);
        const res = await this.workflowService.saveApplication(this.applicationForm.value);
        if (this.appInitiator.isEditModeWorkflowInitior) {
          this.makeInitiaorWorkflowEditable();
        }
        if (res && res.data) {
          if (!this.applicationForm.value.id) {
            this.applicationForm.controls['id'].setValue(res.data.id);
            await this.saveApplicationForm();
          }
          this.toastr.success('success', constants.messages.APPLICATION_SAVE_SUCCESS);
        } else {
          this.toastr.error('error', constants.messages.SERVER_ERROR);
        }
      } catch (err) {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
      }
      finally {
      }
    }
  }

  async saveApplicationForm() {
    if (this.applicationSectionFrom.valid) {
      try {
        const data = [];
        this.userFields = [];
        this.applicationSectionFrom.value.forEach(ele => {
          const d: any = {
            name: ele.name,
            helpText: ele.helpText,
            type: ele.type,
            order: this.applicationSectionFrom.value.indexOf(ele) + 1,
            isActive: ele.isActive,
            applicationFormFields: []
          };
          ele.applicationSectionFormFields.forEach(field => {
            d.applicationFormFields.push({
              id: field.templateOptions.id || '',
              applicationFormSectionId: field.templateOptions.applicationFormSectionId || '',
              name: field.templateOptions.name,
              helpText: field.templateOptions.helpText || '',
              fieldId: field.templateOptions.fieldId,
              key: field.templateOptions.fieldId,
              type: field.templateOptions.type,
              defaultValue: field.templateOptions.defaultValue || '',
              templateName: field.templateOptions.templateName,
              templateOptions: {
                type: field.templateOptions.templateOptionType,
                label: field.templateOptions.name,
                placeholder: field.templateOptions.name,
                required: field.templateOptions.required || false,
                maxLength: field.templateOptions.maxLength || 10000000000,
                decimalPlaces: field.templateOptions.decimalPlaces || 0,
                options: field.templateOptions.options || [],
                isUser: field.templateOptions.isUser || false
              },
              icon: field.templateOptions.icon,
              isActive: field.templateOptions.isActive,
              lookupId: field.templateOptions.lookupId || null,
              order: ele.applicationSectionFormFields.indexOf(field) + 1
            });
            if (field.templateOptions.isUser) {
              this.userFields.push({ id: field.templateOptions.fieldId, name: field.templateOptions.name });
            }
          });
          if (ele.id) {
            d.id = ele.id;
          }
          data.push(d);
        });
        this.spinner.show();
        const res = await this.workflowService.saveApplicationForm(this.applicationForm.value.id, data);
        if (res && res.data) {
          res.data.forEach((x) => {
            const ind = res.data.indexOf(x);
            const fg = this.applicationSectionFrom.controls[ind] as FormGroup;
            if (fg) {
              fg.controls['id'].setValue(x.id);
              this.addPermissionIfNotExistsInArray(x.id, null);
              const formFieldsArr = fg.controls['applicationSectionFormFields'] as FormArray;
              formFieldsArr.value.forEach((ff: any) => {
                const fieldData = _.find(x.applicationFormFields, { fieldId: ff.templateOptions.fieldId });
                if (fieldData) {
                  ff.templateOptions.id = fieldData.id;
                  this.addPermissionIfNotExistsInArray(x.id, fieldData.id);
                }
              });
            }
          });
          await this.savePermissions();
          await this.getFormFieldsTitle();
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

  async saveWorkflows(isRemove = false, workflowType: string = null) {
    try {
      this.spinner.showFull();
      const res = await this.workflowService.saveApplicationWorkflow(this.applicationForm.value.id, this.workflows);
      if (res && res.data) {
        res.data.forEach((x) => {
          const ind = res.data.indexOf(x);
          this.workflows[ind].id = x.id;
          if (x.type === this.workflowTypes.INPUT || x.type === this.workflowTypes.APPROVAL) {
            this.applicationSectionFrom.controls.forEach((aSF) => {
              const fg = aSF as FormGroup;
              if (fg) {
                this.addPermissionIfNotExistsInArray(fg.controls['id'].value, null, x.id, x.type);
                const formFieldsArr = fg.controls['applicationSectionFormFields'] as FormArray;
                formFieldsArr.value.forEach((ff: any) => {
                  this.addPermissionIfNotExistsInArray(fg.controls['id'].value, ff.templateOptions.id, x.id, x.type);
                });
              }
            });
          }
        });
        if (!isRemove && (workflowType === this.workflowTypes.INPUT || workflowType === this.workflowTypes.APPROVAL)) {
          await this.savePermissions();
        }
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

  async savePermissions() {
    try {
      this.spinner.showFull();
      const res = await this.workflowService.saveApplicationFieldPermission(this.applicationForm.value.id, this.permissionsList);
      if (res && res.data) {
        this.permissionsList = [];
        res.data.forEach((p) => {
          this.permissionsList.push({
            id: p.id,
            applicationId: p.applicationId,
            applicationWorkflowId: p.applicationWorkflowId,
            applicationFormSectionId: p.applicationFormSectionId,
            applicationFormFieldId: p.applicationFormFieldId,
            permission: p.permission,
            type: p.type,
            conditions: p.conditions
          });
        });
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

  async publishApp() {
    try {
      if (!this.appInitiator.canAllUserEditApp && !this.appInitiator.editableUserIds.length) {
        this.toastr.error('error', 'Atleast 1 edit user required.');
        return;
      }
      const { value: alertRes } = await this.swalService.warning('Publish App', constants.messages.PUBLISH_APPLICATION_WARNING);
      if (!alertRes) {
        return;
      }
      this.spinner.showFull();
      const editableUsers = this.appInitiator.canAllUserEditApp ? null : this.appInitiator.editableUserIds.join(',');
      // this.applicationForm.controls['editableUserIds'].setValue(editableUsers);
      // this.applicationForm.controls['canAllEdits'].setValue(this.appInitiator.canAllUserEditApp);
      // this.applicationForm.controls['subject'].setValue(this.appInitiator.subject);
      const payload = {
        editableUserIds: editableUsers,
        canAllEdits: this.appInitiator.canAllUserEditApp,
        subject: this.appInitiator.subject
      };
      const res = await this.workflowService.publishApp(this.applicationForm.controls['id'].value, payload);
      if (res && res.data) {
        this.router.navigate(['/workflow', 'dashboard']);
        this.toastr.success('success', constants.messages.APPLICATION_PUBLISH_SUCCESS);
      } else {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
      }
    } catch (ex) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async getEditRecordDetails() {
    try {
      this.spinner.show();
      const res = await this.workflowService.getApplicationById(this.editRecordId);
      if (res) {
        this.editDetails = res.data || {};
        this.createForm();
        await this.getApplicationFormDetails();
        await this.getWorkflows();
        await this.getPermissions();
        await this.getFormFieldsTitle();
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

  async getApplicationFormDetails() {
    try {
      this.spinner.show();
      const res = await this.workflowService.getApplicationForm(this.editRecordId);
      if (res) {
        this.applicationFromDetails = res.data || [];
        if (this.applicationFromDetails.length) {
          this.applicationSectionFrom = this.fb.array([]);
        }
        this.userFields = [];
        this.applicationFromDetails.forEach((x) => {
          this.createApplicationSectionForm(x);
        });
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

  async getWorkflows() {
    try {
      this.spinner.show();
      const res = await this.workflowService.getApplicationWorkflow(this.editRecordId);
      if (res) {
        const wfs = res.data || [];
        wfs.forEach((x) => {
          const wf: IApplicationWorkflow = {
            id: x.id,
            name: x.name,
            showMap: x.showMap,
            canWithdraw: x.canWithdraw,
            applicationId: this.editRecordId,
            type: x.type,
            userIds: [],
            order: x.order,
            stepId: x.stepId,
            assignTo: x.assignTo,
            showAssignToOption: x.assignTo ? true : false,
            groupId: x.groupId
          };
          x.applicationWorkflowPermissions.forEach((permission) => {
            wf.userIds.push(permission.userId);
          });
          this.workflows.push(wf);
        });
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

  async getPermissions() {
    try {
      this.spinner.show();
      const res = await this.workflowService.getPermissions(this.editRecordId);
      if (res) {
        this.permissionsList = res.data || [];
        this.checkCurrentPermission();
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

  async getListData() {
    try {
      this.spinner.show();
      const res = await this.configurationService.getAllLists('0', '0', []);
      if (res) {
        this.lookupData = res.data;
        this.lookupData.splice(0, 0, {
          id: -1,
          name: 'Add New List',
          type: 'NEW'
        });
        this.applicationSectionFrom.value.forEach(ele => {
          ele.applicationSectionFormFields.forEach(field => {
            if (field.templateOptions.templateName === constants.lookupListTemplateName.CHECKBOX) {
              field.formlyProp.fields[4].templateOptions.options = this.lookupData;
            }
            if (field.templateOptions.templateName === constants.lookupListTemplateName.DROPDOWN) {
              field.formlyProp.fields[5].templateOptions.options = this.lookupData;
            }
          });
        });
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

  async getFormFieldsTitle() {
    try {
      this.spinner.show();
      const res: any = await this.workflowService.getFormFieldsTitle(this.applicationForm.controls['id'].value);
      if (res && res.data) {
        this.formFieldsTitles = Array.isArray(res.data.fieldIdsAndName) ? res.data.fieldIdsAndName : [];
      } else {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
        this.formFieldsTitles = []; // Ensure it defaults to an empty array on error
      }
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
      this.formFieldsTitles = []; // Ensure it defaults to an empty array on error
    } finally {
      this.spinner.hide();
    }
  }
  

  async saveEventFormly(model) {
    if (model.lookupId !== -1) {
      if (this.lastTimeoutId !== null && this.lastTimeoutId !== undefined) {
        window.clearTimeout(this.lastTimeoutId);
      }
      this.lastTimeoutId = setTimeout(async () => {
        await this.saveApplicationForm();
        await this.checkCurrentPermission();
      }, 5000);
    }
  }
  //#endregion

  //#region Add New List Modal Dialog
  async openListDataDialog() {
    try {
      this.spinner.showFull();
      const dialogRef = this.dialog.open(AddNewListComponent, {
        width: '50%',
      }).afterClosed().toPromise().then((res) => {
        if (res) {
          this.getListData();
        }
      });
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    }
    finally {
      this.spinner.hide();
    }
  }

  selectChangeEvent(field, $event) {
    if (field.formControl._pendingValue === -1) {
      this.openListDataDialog();
    }
  }
  //#endregion

  drop(event: CdkDragDrop<IWorkflowFields[]>, arr: any) {
    let isSave = false;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const preData = _.cloneDeep(event.previousContainer.data);
      copyArrayItem(preData,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      isSave = true;
    }
    const tempFields = _.cloneDeep(constants.templateOptions[event.item.data.templateName]);
    if (event.item.data.templateName === constants.lookupListTemplateName.DROPDOWN) {
      tempFields[5].templateOptions.options = this.lookupData;
      tempFields[5].templateOptions.change = (field, $event) => { this.selectChangeEvent(field, $event); };
    }
    if (event.item.data.templateName === constants.lookupListTemplateName.CHECKBOX) {
      tempFields[4].templateOptions.options = this.lookupData;
      tempFields[4].templateOptions.change = (field, $event) => { this.selectChangeEvent(field, $event); };
    }
    if (event.item.data.templateName === constants.lookupListTemplateName.DEPARTMENT) {
      tempFields[0].templateOptions.options = this.departmentList;
      tempFields[0].templateOptions.change = (field, $event) => { this.selectChangeEvent(field, $event); };
    }
    arr[event.currentIndex].templateOptions = {
      name: 'Untitled',
      helpText: 'Untitled Help Text',
      fieldId: event.item.data.type + '_' + this.userService.generateRandomString(),
      type: event.item.data.type,
      templateName: event.item.data.templateName,
      icon: event.item.data.icon,
      templateOptionType: event.item.data.templateOptions.type,
      isActive: true,
      options: event.item.data.templateOptions.options || [],
      isUser: event.item.data.templateOptions.isUser || false
    };
    arr[event.currentIndex].formlyProp = {
      templateOptionsForm: new FormGroup({}),
      options: {},
      fields: tempFields
    };
    if (isSave) {
      this.saveApplicationForm();
    }
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return false;
  }
}
