import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';

import { CustomEncoder } from '../http.custom-encoder';

// Interfaces
import { API } from 'src/app/admin/shared/interfaces/api.interface';

@Injectable()
export class EncodeHttpParamsInterceptor implements HttpInterceptor {
  intercept<T>(req: HttpRequest<API<T>>, next: HttpHandler): Observable<HttpEvent<API<T>>> {
    const params: HttpParams = new HttpParams({
      encoder: new CustomEncoder(),
      fromString: req.params.toString(),
    });
    return next.handle(req.clone({ params }));
  }
}
