import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { SpinnerService } from '../services/spinner.service';
import { constants } from '../../helper/constants';

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

// Interfaces
import { API } from 'src/app/admin/shared/interfaces/api.interface';
import { ToasterService } from '../services/toaster.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private toasterService: ToasterService, private spin: SpinnerService,
    private router: Router) { }

  intercept<T>(req: HttpRequest<API<T>>, next: HttpHandler): Observable<HttpEvent<API<T>>> {
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<API<T>>) => {
          if (event.type !== 0) {
          }
          // do stuff on success
        },
        (error: HttpErrorResponse) => {
          const errorIgnorList: string[] = [];
          // If url does not exist in errorIgnorList then show error toast.
          if (errorIgnorList.indexOf(req.url) === -1) {
            if (error.status === 401) {
              this.router.navigate(['/sign-in']);
              this.spin.hide();
            } else if (error.status === 403) {
              this.toasterService.error('Error', constants.messages.ACCESS_DENIED);
              this.spin.hide();
            } else if (typeof error.error === 'string') {
              this.toasterService.error('Error', error.error);
            } else {
              this.toasterService.error('Error', error.error.meta.message);
            }
          }
          return throwError(error);
        },
      ),
    );
  }
}
