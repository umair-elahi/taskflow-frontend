import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

// Services
import { RequestCacheService } from '../services/request-cache.service';

// Interfaces
import { API } from 'src/app/admin/shared/interfaces/api.interface';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private requestCacheService: RequestCacheService) {}

  intercept<T>(req: HttpRequest<API<T>>, next: HttpHandler): Observable<HttpEvent<API<T>>> {
    const isCachable: boolean = req.params.has('cache');
    const params: HttpParams = req.params.delete('cache');

    req = req.clone({
      params: params,
    });

    const cachedResponse: HttpEvent<API<T>> = this.requestCacheService.get(req);
    return cachedResponse ? of(cachedResponse) : this.sendRequest<T>(isCachable, req, next);
  }

  sendRequest<T>(
    isCachable: boolean,
    req: HttpRequest<API<T>>,
    next: HttpHandler,
  ): Observable<HttpEvent<API<T>>> {
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<API<T>>) => {
          if (isCachable && event instanceof HttpResponse) {
            this.requestCacheService.put(req, event);
          }
        },
        (err: Error) => {
          if (err) {
            return throwError(err);
          }
        },
      ),
    );
  }
}
