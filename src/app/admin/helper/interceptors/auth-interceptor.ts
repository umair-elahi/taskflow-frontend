import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { SpinnerService } from '../services/spinner.service';

import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';

import { environment } from '../../../../environments/environment';

// Interfaces
import { API } from 'src/app/admin/shared/interfaces/api.interface';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private baseUrl: string = environment.apiBase;
  constructor(private userSerivce: UserService, private spin: SpinnerService) { }

  intercept<T>(req: HttpRequest<API<T>>, next: HttpHandler): Observable<HttpEvent<API<T>>> {
    const params: HttpParams = req.params;
    let headers: HttpHeaders = req.headers;
    headers.set('Access-Control-Allow-Origin', '*');
    if (environment.appVersion) {
      headers = headers.set('appversion', environment.appVersion.toString());
    }
    if (environment.platform) {
      headers = headers.set('platform', environment.platform);
    }
    if (req.url !== 'auth/login') {
      headers = headers.set('authorization', this.userSerivce.getToken());
    }
    return this.sendRequest<T>(next, req, headers, params);
  }

  sendRequest<T>(
    next: HttpHandler,
    req: HttpRequest<API<T>>,
    headers: HttpHeaders,
    params: HttpParams,
  ): Observable<HttpEvent<API<T>>> {
    const apiUrl = `${this.baseUrl}${req.url}`;
    // this.spin.show();
    req = req.clone({
      url: apiUrl,
      headers,
      params,
    });
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<API<T>>) => { },
        (err: Error) => {
          if (err) {
            return throwError(err);
          }
        },
      ),
    );
  }
}
