import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { ToasterService } from './toaster.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private httpClient: HttpClient, private userSerivce: UserService,
    private toaster: ToasterService) { }

  postFile(fileToUpload: File, fileFor) {
    const endpoint = 'file/' + fileFor;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post(endpoint, formData).toPromise();
  }

  postExecutionFile(fileToUpload: File, data: any) {
    const endpoint = 'file/execution';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('applicationId', data.applicationId);
    formData.append('formFieldId', data.formFieldId);
    return this.httpClient
      .post(endpoint, formData).toPromise();
  }
}
