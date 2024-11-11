import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  title: Subject<any>;

  constructor() {
    this.title = new Subject<any>();
  }

  setTitle(title: String, subTitle: String) {
    document.title = environment.appName + ' - ' + subTitle;
    this.title.next({
      title: title,
      subTitle: subTitle
    });
  }

  onSetTitle(): Observable<any> {
    return this.title;
  }
}
