import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISaveApplication } from './create-workflow/IWorkflowCreate';
import { ConfigurationService } from '../configuration/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  configurationService: any;

  constructor(private http: HttpClient) { }

  getAllRawExecutionData(): Promise<any> {
    return this.http.get(`application-execution/all-raw-data`).toPromise(); 
  }

  getApplicationTimelineReport(appId: string, startDate: string, endDate: string): Promise<any> {
    return this.http.get(`application-execution/application/${appId}/time`, { params: { startDate: startDate, endDate: endDate } }).toPromise();
  }

  // Application First Step
  getApplications(pageNo: string, noOfRecords: string, searchText: any[]): Promise<any> {
    return this.http.get(`application`).toPromise();
  }

  saveApplication(body: ISaveApplication): Promise<any> {
    if (!body.id) {
      delete body.id;
    }
    return this.http.post(`application`, body).toPromise();
  }

  getApplicationById(id: string): Promise<any> {
    return this.http.get(`application/${id}`).toPromise();
  }

  getApplicationForm(id: string, forExecution = false): Promise<any> {
    return this.http.get(`application/${id}/form?forExecution=${forExecution}`).toPromise();
  }

  getApplicationWorkflow(id: string): Promise<any> {
    return this.http.get(`application/${id}/workflow`).toPromise();
  }

  saveApplicationForm(appId: string, body: any): Promise<any> {
    return this.http.post(`application/${appId}/form`, body).toPromise();
  }

  saveApplicationWorkflow(appId: string, body: any): Promise<any> {
    return this.http.post(`application/${appId}/workflow`, body).toPromise();
  }

  saveApplicationFieldPermission(appId: string, body: any): Promise<any> {
    return this.http.post(`application/${appId}/field-permission`, body).toPromise();
  }

  publishApp(appId: string, body: any): Promise<any> {
    return this.http.put(`application/${appId}/publish`, body).toPromise();
  }

  getPermissions(id: string): Promise<any> {
    return this.http.get(`application/${id}/field-permission`).toPromise();
  }

  deleteApplication(Id: string): Promise<any> {
    return this.http.delete(`application/` + Id).toPromise();
  }

  // execution
  getAllWorkflowExecutionsByApp(id: any) {
    return this.http.get(`application-execution/${id}/execution`).toPromise();
  }

  getAllExecutions() {
    return this.http.get(`application-execution/all`).toPromise();
  }

  getExecutionsById(id: any) {
    return this.http.get(`application-execution/${id}/detail`).toPromise();
  }

  deleteExecutionById(id: string): Promise<any> {
    return this.http.delete(`application-execution/execution/${id}`).toPromise();
  }

  saveWorkflowExecution(id: any, body: any) {
    return this.http.post(`application-execution/${id}/execution`, body).toPromise();
  }

  saveWorkflowExecutionForm(id: any, body: any) {
    return this.http.put(`application-execution/${id}/execution/form`, body).toPromise();
  }

  publishExecution(appId: string, executionId: string) {
    return this.http.put(`application-execution/${appId}/execution/${executionId}/publish`, {}).toPromise();
  }

  getExecutionByStatus(status: string) {
    return this.http.get(`application-execution/workflow/action`, { params: { status: status } }).toPromise();
  }

  getMyExecutions(type: string, status?: string) {
    return this.http.get(`application-execution/workflow`, { params: { status, type } }).toPromise();
  }

  getAllMyExecutions(status: string, type: string = '', applicationId: string = '', startDate = '', endDate = '') {
    const params = { status };
    if (type) {
      params['type'] = type;
    }
    if (applicationId) {
      params['applicationId'] = applicationId;
    }
    if (startDate) {
      params['startDate'] = startDate;
    }
    if (endDate) {
      params['endDate'] = endDate;
    }
    return this.http.get(`application-execution/workflow/action/query`, { params }).toPromise();
  }

  getMyParticipatedExecution(searchText: String = null, startDate = '', endDate = '') {
    const params = {};
    if (searchText) {
      params['searchText'] = searchText;
    }
    if (startDate) {
      params['startDate'] = startDate;
    }
    if (endDate) {
      params['endDate'] = endDate;
    }
    return this.http.get(`application-execution/participated/query`, { params }).toPromise();
  }

  getMyWithdrawExecution(filter: any = null) {
    const params: any = {};
    if (filter.applicationId) {
      params.applicationId = filter.applicationId;
    } if (filter.startDate) {
      params.startDate = filter.startDate;
    } if (filter.endDate) {
      params.endDate = filter.endDate;
    }
    return this.http.get(`application-execution/withdraw`, { params }).toPromise();
  }

  getInProgressExecution(appId, startDate = '', endDate = '') {
    const params = {};
    if (startDate) {
      params['startDate'] = startDate;
    }
    if (endDate) {
      params['endDate'] = endDate;
    }
    return this.http.get(`application-execution/${appId}/in-progress`, { params }).toPromise();
  }

  getTransformExecutionById(id, status) {
    return this.http.get(`application-execution/${id}/transformed?status=${status}`).toPromise();
  }

  getParticipatedExecutions() {
    return this.http.get(`application-execution/participated`).toPromise();
  }

  saveApplicationExecutionWorkflow(appId: string, executionId: string, workflowId: string, data: any) {
    return this.http.put(`application-execution/${appId}/execution/${executionId}/workflow/${workflowId}`, data).toPromise();
  }

  getExecutionInProcessLoggedInUserIdCount() {
    return this.http.get(`application-execution/workflow/action/count`).toPromise();
  }

  getFormFieldsTitle(applicationId: string) {
    return this.http.get(`application/${applicationId}/form-field-titles`).toPromise();
  }

  reAssign(data: any) {
    return this.http.put(`application-execution/${data.executionId}/reassign`, data).toPromise();
  }

  withdraw(executionId: any, executionWorkflowId: string) {
    return this.http.put(`application-execution/${executionId}/withdraw/${executionWorkflowId}`, {}).toPromise();
  }

  getExecutionParticipatedUsers(executionId: any): Promise<any> {
    return this.http.get(`application-execution/${executionId}/users`).toPromise();
  }

  deleteExecutionWithFiles(data: any): Promise<any> {
    return this.http.post(`application-execution/${data.applicationId}`, data).toPromise();
  }


  getTaskCountByExecutionId(executionId: string): Promise<number> {
    return this.http.get<{ count: number }>(`application-execution/${executionId}/tasks/count`).toPromise().then(response => response.count);
}

getTotalExecutionsCount(): Promise<number> {
  // Assuming there's an endpoint that provides the total execution count
  return this.http.get<number>('/api/executions/count').toPromise();
}

  // workflow helper
  // async parseData(tempList) {
  //   const formFields = {};
  //   for (const ex of tempList) {
  //     for (const ef of ex.applicationExecutionForms) {
  //       if (ef.applicationFormField.templateOptions.type === 'select') {
  //         const lookupData = await this.configurationService.getLookupDataById(ef.value);
  //         ef.value = lookupData.data.value;
  //       }
  //       formFields[ef.applicationFormFieldId] = ef.value;
  //     }
  //     for (const ele of ex.application.applicationFormSections) {
  //       for (const field of ele.applicationFormFields) {
  //         field.value = formFields[field.id] || '';
  //       }
  //     }
  //   }
  // }
}
