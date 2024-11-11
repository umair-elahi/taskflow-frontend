import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as menuConstants from '../../helper/menu-constants';
// services
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../../helper/services/user.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { environment } from '../../../../environments/environment';
import { SpinnerService } from '../../helper/services/spinner.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  loginForm: FormGroup;
  constructor(private fb: FormBuilder, public authService: AuthenticationService,
    private userService: UserService, private toaster: ToasterService, private router: Router,
    private spinner: SpinnerService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
      branchId: [1, Validators.compose([Validators.required])]
    });
  }

  async login() {
    if (this.loginForm.valid) {
      try {
        this.spinner.showFull();
        const res = await this.authService.signIn(this.loginForm.value);
          this.userService.loginUser(res.data);
          this.toaster.success('Success', 'Welcome to ' + environment.appName);
          this.userService.setCurrentModule(menuConstants.MenuConstants[0].Name);
          this.router.navigate(menuConstants.MenuConstants[0].Childrens[0].Link);
          this.spinner.hide();
      } catch (err) {
        this.toaster.error('Error', 'Error while login please try latter');
        this.spinner.hide();
      }
    }
  }

}
