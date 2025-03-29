import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../helper/services/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { MenuConstants } from '../../helper/menu-constants';
import { RefreshSideMenuService } from '../../helper/services/refresh-side-menu.service';
import { SpinnerService } from '../../helper/services/spinner.service';
import { SidebarService } from '../../helper/services/sidebar.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  userName: Object = {};
  profilePic: String = 'assets/images/profile.jpg';
  currentModuleName: String = '';
  appModules: any = MenuConstants;
  currentUrl: string = '';

  // Two flags for the two different modals
  showModal = false;        // For the "th-large" button
  showProfileModal = false; // For the profile image

  constructor(
    private _UserService: UserService,
    private _Router: Router,
    private _refreshSideMenuService: RefreshSideMenuService,
    private spinner: SpinnerService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.userName = this._UserService.getUserName();
    this.profilePic = this._UserService.getProfilePicture();
    this.currentModuleName = this._UserService.getCurrentModule();
    // Subscribe to router events to update the current URL and close any open modal
    this._Router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
      // Automatically close both modals on navigation
      if (this.showModal) {
        this.closeModal();
      }
      if (this.showProfileModal) {
        this.closeProfileModal();
      }
    });
    // Set the initial URL
    this.currentUrl = this._Router.url;
  }

  ngAfterViewInit() {
    const headerDiv = document.querySelector('.header > div');
    if (headerDiv) {
      const buttons = headerDiv.querySelectorAll('button');
      if (buttons.length > 1) {
        buttons[1].addEventListener('click', () => {
          this.showModal = true;
        });
      }
    }
    const imgEl = document.querySelector('.header img');
    if (imgEl) {
      imgEl.addEventListener('click', () => {
        this.showProfileModal = true;
      });
    }
  }

  logoutUser() {
    this._UserService.logoutUser();
    this._Router.navigate(['sign-in']);
  }

  // Helper function to log out and close the profile modal.
  logoutAndClose() {
    this.logoutUser();
    this.closeProfileModal();
  }

  menuChange(mod: any) {
    if (this.currentModuleName === mod.Name) return;

    this.spinner.showFull();
    this.currentModuleName = mod.Name;
    this._UserService.setCurrentModule(mod.Name);
    this._Router.navigate(mod.Childrens[0].Link);
    this._refreshSideMenuService.refreshMenu();

    // Automatically close the modules modal upon navigation.
    this.closeModal();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  closeModal() {
    this.showModal = false;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }
}
