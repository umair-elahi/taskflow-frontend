import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from '../../helper/services/title.service';
import { UserService } from '../../helper/services/user.service';
import { MenuConstants } from '../../helper/menu-constants';
import { RefreshSideMenuService } from '../../helper/services/refresh-side-menu.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { constants } from '../../helper/constants';
import { ToasterService } from '../../helper/services/toaster.service';
import { MenuCountsService } from '../../helper/services/menu-counts.service';
import { SidebarService } from '../../helper/services/sidebar.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  taskCount: number;
  title: string = 'Dashboard';
  rights: any = [];
  user: any = {};
  menus: any = [];
  menuCounts: any = {};
  isVisible = false;
  userRole: string = '';

  constructor(
    private titleService: TitleService,
    private _UserService: UserService,
    private _Router: Router,
    private _refreshSideMenuService: RefreshSideMenuService,
    private spinner: SpinnerService,
    private toastr: ToasterService,
    private menuCountsService: MenuCountsService,
    private sidebarService: SidebarService
  ) {
    this.user = this._UserService.getUser();
  }

  async ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = user.roles[0];

    this.rights = this.user.Rights;
    this.titleService.onSetTitle().subscribe((res) => {
      this.title = res.subTitle;
    });
    this._refreshSideMenuService.onRefresh().subscribe(() => {
      this.getMenusByModule();
    });
    this.getMenusByModule();

    // Subscribe to sidebar state changes
    this.sidebarService.sidebarState$.subscribe((state) => {
      this.isVisible = state;
    });
  }

  getMenusByModule() {
    const moduleName = this._UserService.getCurrentModule();
    const tempMenus: any = MenuConstants.find((x) => x.Name === moduleName);
    this.menus = tempMenus.Childrens;
  }

  goTo(menu: any) {
    const url = menu.Link.join('/').toLowerCase();
    if (this._Router.url !== url) {
      this.spinner.showFull();
      this._Router.navigate(menu.Link).then(() => {
        // Collapse the sidebar if the screen width is below 768 pixels
        if (window.innerWidth < 768) {
          this.sidebarService.collapseSidebar();
        }
      });
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
