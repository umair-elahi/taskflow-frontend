import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[appAdminAuth]'
})
export class AdminAuthDirective implements OnInit {

  user: any = {};

  constructor(private el: ElementRef, private _user: UserService) {
    this.user = this._user.getUser();
  }

  // tslint:disable-next-line:no-input-rename
  @Input('appAdminAuth') appAdminAuth: string;
  ngOnInit() {
    if (this.user.Rights.indexOf(this.appAdminAuth.toUpperCase()) <= -1) {
      // this.el.nativeElement.style.display = 'none';
      // this.el.nativeElement.disabled = true;
    }
  }
}
