import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from '../../helper/services/title.service';
import { UserService } from '../../helper/services/user.service';
import { MenuConstants } from '../../helper/menu-constants';
import { RefreshSideMenuService } from '../../helper/services/refresh-side-menu.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { constants } from '../../helper/constants';
import { ToasterService } from '../../helper/services/toaster.service';
import { MenuCountsService } from '../../helper/services/menu-counts.service';
// import { ExecutionListComponent} from '../../workflow/execution-task-list/execution-task-list.component'

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  taskCount: number;
  title: String = 'Dashboard';
  rights: any = [];
  user: any = {};
  menus: any = [];
  menuCounts: any = {};
  constructor(private titleService: TitleService, private _UserService: UserService, private _Router: Router,
    private _refreshSideMenuService: RefreshSideMenuService, private spinner: SpinnerService,
    private toastr: ToasterService, private menuCountsService: MenuCountsService, 
    // private ExecutionListComponent: ExecutionListComponent
  ) {
    this.user = this._UserService.getUser();
  }

  async ngOnInit() {
    // this.taskCount = this.ExecutionListComponent.lists;
    this.rights = this.user.Rights;
    this.titleService.onSetTitle().subscribe((res) => {
      this.title = res.subTitle;
    });
    this._refreshSideMenuService.onRefresh().subscribe(() => {
      this.getMenusByModule();
    });
    this.getMenusByModule();
    // this.menuCountsService.refreshCounts();
    // this.getMenuCounts();
  }

  getMenusByModule() {
    const moduleName = this._UserService.getCurrentModule();
    const tempMenus: any = MenuConstants.find((x) => {
      return x.Name === moduleName;
    });
    this.menus = tempMenus.Childrens;
  }

  getMenuCounts() {
    this.menuCountsService.menu.subscribe((res) => {
      this.menuCounts = res;
    });
  }

  goTo(menu: any) {
    const url = menu.Link.join('/').toLowerCase();
    if (this._Router.url !== url) {
      this.spinner.showFull();
      this._Router.navigate(menu.Link);
    }
  }
}
