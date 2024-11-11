import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExecutionListService {
  private taskCountSubject = new BehaviorSubject<number>(0);  // Initialize with 0 tasks

  // Observable to subscribe to task count changes
  get taskCount$() {
    return this.taskCountSubject.asObservable();
  }

  // Setter to update task count
  set taskCount(count: number) {
    this.taskCountSubject.next(count);
  }
}
