import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationService } from '../configuration.service';
import { TitleService } from '../../helper/services/title.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { constants } from '../../helper/constants';
import * as moment from 'moment';
import { IMyProfileModel } from './IMyProfileModel';
import { SpinnerService } from '../../helper/services/spinner.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  imagePath = '';
  userForm: FormGroup;
  genders: any = [{ name: 'Male' }, { name: 'Female' }, { name: 'Not Specified' }];
  roles: any = [];
  editDetails: any = null;
  isFormBinded = false;
  fileToUpload: any;
  user: IMyProfileModel;
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,
    private configurationService: ConfigurationService, private _ActivatedRoute: ActivatedRoute,
    private toastr: ToasterService, private titleService: TitleService, private spinner: SpinnerService) { }

  ngOnInit() {
    this.titleService.setTitle('Admin', 'My Profile');
    this.roles = this._ActivatedRoute.snapshot.data['data'].roles;
    this.user = this._ActivatedRoute.snapshot.data['data'].user;
    this.editDetails = this.user || {};
    this.imagePath = this.editDetails.pictureUrl;
    this.createForm();
    this.spinner.hide();
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imagePath = myReader.result as string;
    };
    myReader.readAsDataURL(this.fileToUpload);
  }

  createForm() {
    this.isFormBinded = false;
    this.userForm = this.fb.group({
      id: [this.editDetails ? (this.editDetails.id || null) : null],
      firstName: [this.editDetails ? (this.editDetails.firstName || '') : '', Validators.compose([Validators.required])],
      lastName: [this.editDetails ? (this.editDetails.lastName || '') : '', Validators.compose([Validators.required])],
      email: [this.editDetails ? (this.editDetails.email || '') : '', Validators.compose([Validators.required, Validators.email])],
      roleIds: [this.editDetails ? (this.editDetails.roleIds || '') : '', Validators.compose([Validators.required])],
      roleIdss: [this.editDetails ? (this.editDetails.roleIds || '') : '', Validators.compose([Validators.required])],
      contactNo: [this.editDetails ? (this.editDetails.contactNo || '') : ''],
      gender: [this.editDetails ? (this.editDetails.gender || '') : ''],
      timezone: [this.editDetails ? (this.editDetails.timezone || moment().format('Z')) : moment().format('Z')],
      pictureUrl: [this.editDetails ? (this.editDetails.pictureUrl || '') : '']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.compose([Validators.required])],
      newPassword: ['', Validators.compose([Validators.required])],
    });

    this.userForm.controls.roleIdss.disable();
    this.isFormBinded = true;
  }

  async savePassword() {
    if (this.passwordForm.valid) {
      try {
        this.spinner.showFull();
        const body = this.passwordForm.value;
        const res = await this.configurationService.ChangePassword(body);
        if (res) {
          this.passwordForm.reset();
          this.toastr.success('success', constants.messages.PASSWORD_SAVE_SUCCESS);
        } else {
          this.toastr.error('error', constants.messages.SERVER_ERROR);
        }
      } catch (err) {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
      }
      finally {
        this.spinner.hide();
      }
    }
  }
  async saveUser() {
    if (this.fileToUpload) {
      const pic = { data: { url: '' } }; // await this.configurationService.SaveImage(this.fileToUpload);
      this.userForm.controls['pictureUrl'].setValue(pic.data.url);
      this.imagePath = pic.data.url;
    }

    if (this.userForm.valid) {
      try {
        this.spinner.showFull();
        const body = this.userForm.value;
        const res = await this.configurationService.saveUser(body);
        if (res) {
          this.toastr.success('success', constants.messages.PROFILE_UPDATED);
        } else {
          this.toastr.error('error', constants.messages.SERVER_ERROR);
        }
      } catch (err) {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
      }
      finally {
        this.spinner.hide();
      }
    }
  }
}
