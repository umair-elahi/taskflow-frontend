import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WorkflowService } from '../../workflow/workflow.service';

@Injectable({
  providedIn: 'root'
})
export class MenuCountsService {

  menu: Subject<any>;

  constructor(private workflowService: WorkflowService) {
    this.menu = new Subject<any>();
  }

// MenuCountsService
async refreshCounts() {
  try {
    const res: any = await this.workflowService.getExecutionInProcessLoggedInUserIdCount();
    console.log('Fetched Data:', res); // Log fetched data
    this.menu.next(res.data); // Emit the datay
  } catch (err) {
    console.error('Error fetching menu counts:', err);
  }
}


  onSetTitle(): Observable<any> {
    return this.menu;
  }
}
