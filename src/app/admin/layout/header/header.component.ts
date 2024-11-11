import { Component, OnInit } from '@angular/core';
import { UserService } from '../../helper/services/user.service';
import { Router } from '@angular/router';
import { MenuConstants } from '../../helper/menu-constants';
import { RefreshSideMenuService } from '../../helper/services/refresh-side-menu.service';
import { SpinnerService } from '../../helper/services/spinner.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userName: Object = {};
  profilePic: String = 'assets/images/profile.jpg';
  currentModuleName: String = '';
  appModules: any = MenuConstants;
  constructor(private _UserService: UserService, private _Router: Router,
    private _refreshSideMenuService: RefreshSideMenuService,
    private spinner: SpinnerService) { }

  ngOnInit() {
    this.userName = this._UserService.getUserName();
    this.profilePic = this._UserService.getProfilePicture();
    this.currentModuleName = this._UserService.getCurrentModule();
  }

  logoutUser() {
    this._UserService.logoutUser();
    this._Router.navigate(['sign-in']);
  }

  menuChange(mod: any) {
    this.spinner.showFull();
    this.currentModuleName = mod.Name;
    this._UserService.setCurrentModule(mod.Name);
    this._Router.navigate(mod.Childrens[0].Link);
    this._refreshSideMenuService.refreshMenu();
  }
}
