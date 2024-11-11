/* tslint:disable:no-any */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestCacheService {

  constructor() { }

  cache: any = new Map<string, HttpResponse<any>>();

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url: string = req.urlWithParams;
    return this.cache.get(url);
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url: string = req.urlWithParams;
    this.cache.set(url, response);
  }
}
