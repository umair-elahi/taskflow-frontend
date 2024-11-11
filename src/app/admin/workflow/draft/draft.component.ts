import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../helper/services/toaster.service';
import { SwalService } from '../../helper/services/swal.service';
import { WorkflowService } from '../workflow.service';
import { TitleService } from '../../helper/services/title.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { constants } from '../../helper/constants';

import { ApplicationWorkflowType } from '../../helper/enum';
import { ConfigurationService } from '../../configuration/configuration.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements OnInit {

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
  constructor(private toastr: ToasterService, private swalService: SwalService, private titleService: TitleService,
    private router: Router, private workflowService: WorkflowService, private spinner: SpinnerService,
    private configurationService: ConfigurationService) { }

  async ngOnInit() {
    if (this.router.url !== '/workflow/dashboard') {
      this.titleService.setTitle('Workflow', 'Draft');
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
      const res: any = await this.workflowService.getMyExecutions(ApplicationWorkflowType.APPROVAL, constants.executionStatus.DRAFT);
      this.tempList = res.data;
      await this.parseData();
      this.totalRecords = res.data.length;
      this.range = _.range(Math.ceil(res.data.length / parseInt(this.filters.noOfPages.toString(), 0)));
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
          if (ef.value) {
            const lookupData = await this.configurationService.getLookupDataById(ef.value);
            ef.value = lookupData.data.value;
          }
        }
        formFields[ef.applicationFormFieldId] = ef.value;
      }
      for (const ele of ex.application.applicationFormSections) {
        for (const field of ele.applicationFormFields) {
          field.value = formFields[field.id] || '';
        }
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

  getLink(link: string) {
    return environment.downloadimage + link;
  }
}
