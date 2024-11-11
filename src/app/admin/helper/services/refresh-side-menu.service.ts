import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshSideMenuService {

  refresh: Subject<boolean>;

  constructor() {
    this.refresh = new Subject<boolean>();
  }

  refreshMenu() {
    this.refresh.next(true);
  }

  onRefresh(): Observable<boolean> {
    return this.refresh;
  }
}
