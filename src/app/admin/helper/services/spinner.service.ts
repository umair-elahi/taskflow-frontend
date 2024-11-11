import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  spinner: Subject<any>;

  constructor() {
    this.spinner = new Subject<any>();
  }

  show() {
    this.spinner.next({
      show: true,
      full: false
    });
  }

  hide() {
    this.spinner.next({
      show: false,
      full: false
    });
  }

  showFull() {
    this.spinner.next({
      show: true,
      full: true
    });
  }

  hideFull() {
    this.spinner.next({
      show: false,
      full: true
    });
  }

  showSpinner(): Observable<any> {
    return this.spinner;
  }
}
