import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Makes this service available everywhere
})
export class SidebarService {
  private sidebarVisible = new BehaviorSubject<boolean>(false); // Store sidebar state (true/false)
  sidebarState$ = this.sidebarVisible.asObservable(); // Observable to listen for changes

  toggleSidebar() {
    this.sidebarVisible.next(!this.sidebarVisible.value); // Toggle the sidebar state
  }

  // New method: collapse the sidebar (set visibility to false)
  collapseSidebar() {
    this.sidebarVisible.next(false);
  }
}
