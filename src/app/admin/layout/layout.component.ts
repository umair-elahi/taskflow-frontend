import { Component, OnInit } from '@angular/core';
import { TitleService } from '../helper/services/title.service';
import * as App from '../../../assets/js/theme-fun';
import { SidebarService } from '../helper/services/sidebar.service'; // ✅ Import SidebarService

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  title: String = 'Dashboard';
  subTitle: String = 'Control Panel';
  isSidebarCollapsed: boolean = false; // ✅ Track sidebar state

  constructor(
    private titleService: TitleService,
    private sidebarService: SidebarService
  ) {

  }

  ngOnInit() {
    App.init();
    this.setTitle();

    // ✅ Subscribe to sidebar state changes
    this.sidebarService.sidebarState$.subscribe(state => {
      this.isSidebarCollapsed = !state;
    });
  }

  setTitle() {
    this.titleService.onSetTitle().subscribe((res) => {
      this.title = res.title;
      this.subTitle = res.subTitle;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar(); // ✅ Toggle sidebar visibility
  }
}

