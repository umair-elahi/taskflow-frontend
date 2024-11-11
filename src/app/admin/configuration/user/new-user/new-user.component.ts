import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '../../../helper/services/toaster.service';
import { TitleService } from '../../../helper/services/title.service';
import { ConfigurationService } from '../../configuration.service';
import { constants } from '../../../helper/constants';
import * as moment from 'moment';
import { SpinnerService } from 'src/app/admin/helper/services/spinner.service';

interface ValidationResult {
  [key: string]: boolean;
}
@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  imagePath = '';
  userForm: FormGroup;
  roles: any = [];
  units: any = [];
  departments: any = [];
  officeLocations: any = [];
  managers: any = [];
  genders: any = [{ name: 'Male' }, { name: 'Female' }, { name: 'Not Specified' }];
  editDetails: any = null;
  editRecordId = 'new';
  isFormBinded = false;
  private sub: any;
  BranchIds: any;
  fileToUpload: any;
  passwordError = false;
  constructor(private fb: FormBuilder, private router: Router,
    private configurationService: ConfigurationService, private _ActivatedRoute: ActivatedRoute,
    private toastr: ToasterService, private titleService: TitleService, private spinner: SpinnerService) { }

  ngOnInit() {
    this.titleService.setTitle('Admin', 'New User');
    this.roles = this._ActivatedRoute.snapshot.data['data'].roles;
    this.departments = this._ActivatedRoute.snapshot.data['data'].departments;
    this.officeLocations = this._ActivatedRoute.snapshot.data['data'].officeLocations;
    this.managers = this._ActivatedRoute.snapshot.data['data'].users;
    this.editRecordId = this._ActivatedRoute.snapshot.paramMap.get('id');
    if (this.editRecordId && this.editRecordId !== 'new') {
      this.titleService.setTitle('Admin', 'Update User');
      this.getEditRecordDetails();
      this.managers = this.managers.filter(m => m.id !== this.editRecordId);
    } else {
      this.createForm();
    }
  }

  checkPasswordValidatiion() {
    const userId = this.userForm.controls['id'].value;
    if (userId) {
    } else {
      const Password = this.userForm.controls['password'].value;
      if (Password === '') {
        this.passwordError = true;
        return true;
      }
    }
    this.passwordError = false;
    return false;
  }

  OnDestroy() {
    this.sub.unsubscribe();
  }

  async getEditRecordDetails() {
    try {
      const res = await this.configurationService.getUserById(this.editRecordId);
      if (res) {
        this.editDetails = res.data || {};
        this.imagePath = this.editDetails.pictureUrl;
        this.createForm();
      } else {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
      }
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    }
    finally {
    }
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
      password: [this.editDetails ? (this.editDetails.password || '') : ''],
      roleIds: [this.editDetails ? (this.editDetails.roleIds || '') : '', Validators.compose([Validators.required])],
      contactNo: [this.editDetails ? (this.editDetails.contactNo || '') : ''],
      gender: [this.editDetails ? (this.editDetails.gender || '') : ''],
      departmentId: [this.editDetails ? (this.editDetails.departmentId || '') : '', Validators.compose([Validators.required])],
      managerId: [this.editDetails ? (this.editDetails.managerId || '') : '', Validators.compose([Validators.required])],
      officeLocationId: [this.editDetails ? (this.editDetails.officeLocationId || '') : '', Validators.compose([Validators.required])],
      timezone: [this.editDetails ? (this.editDetails.timezone || moment().format('Z')) : moment().format('Z')],
      pictureUrl: [this.editDetails ? (this.editDetails.pictureUrl || '') : '']
    });
    this.isFormBinded = true;
    this.imagePath = this.editDetails ? this.editDetails.pictureUrl : '';
    this.spinner.hide();
  }

  async saveUser() {
    if (this.checkPasswordValidatiion()) {
      return;
    }
    if (this.fileToUpload) {
      const pic = { data: { url: '' } }; // await this.configurationService.SaveImage(this.fileToUpload);
      this.userForm.controls['pictureUrl'].setValue(pic.data.url);
      this.imagePath = pic.data.url;
    }

    if (this.userForm.valid) {
      try {
        this.spinner.showFull();
        const res = await this.configurationService.saveUser(this.userForm.value);
        if (res) {
          this.toastr.success('success', constants.messages.USER_SAVE_SUCCESS);
          this.router.navigate(['/admin', 'users']);
        } else {
          this.toastr.error('error', constants.messages.SERVER_ERROR);
        }
      } catch (err) {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
        this.imagePath = '';
      }
      finally {
        this.spinner.hide();
      }
    }
  }
}
