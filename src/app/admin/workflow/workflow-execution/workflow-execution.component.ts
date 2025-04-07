import { Component, OnInit } from '@angular/core';
import { IListModel } from '../../configuration/list/IListModel';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { WorkflowService } from '../workflow.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleService } from '../../helper/services/title.service';
import { UserService } from '../../helper/services/user.service';
import { SwalService } from '../../helper/services/swal.service';
import { constants } from '../../helper/constants';
import { ConfigurationService } from '../../configuration/configuration.service';
import * as _ from 'lodash';
import { SpinnerService } from '../../helper/services/spinner.service';
import { FileUploadService } from '../../helper/services/file-upload.service';
import { environment } from 'src/environments/environment';
import { MenuCountsService } from '../../helper/services/menu-counts.service';
import { IUserModel } from '../../configuration/user/IUserModel';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-workflow-execution',
  templateUrl: './workflow-execution.component.html',
  styleUrls: ['./workflow-execution.component.scss']
})
export class WorkflowExecutionComponent implements OnInit {
  public isFormBinded: Boolean = false;
  lookupData: IListModel[];
  users: IUserModel[];
  applicationId: any = null;
  executionId: any = 'new';
  applicationDetails: any = null;
  applicationFormSection = null;
  editDetails: any = null;
  formFiles: any = {};
  downloadButtons: any = [];
  coords: any = {};
  state: String = 'open';

  // FILE RESTRICTION ADDITIONS START
  allowedExtensions = ["jpeg", "jpg", "webp", "csv", "xls", "xlsx", "xlsm", "ppt", "pptx", "pps", "doc", "docx", "pdf"];
  allowedMimeTypes = [
    'image/jpeg',
    'image/webp',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf'
  ];
  // FILE RESTRICTION ADDITIONS END

  showModal = false;
  sanitizedPreviewUrl: SafeResourceUrl = '';
  sanitizedImageUrl: SafeUrl = '';
  currentFilePath: string = '';
  currentScale = 1;
  minScale = 0.1;
  maxScale = 5;
  scaleStep = 0.25;
  
  // CSV preview data
  csvHeaders: string[] = [];
  csvData: string[][] = [];

  constructor(
    private fb: FormBuilder,
    private workflowService: WorkflowService,
    private toastr: ToasterService,
    private swalService: SwalService,
    private titleService: TitleService,
    private _ActivatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private configurationService: ConfigurationService,
    private spinner: SpinnerService,
    private fileUploadService: FileUploadService,
    private sanitizer: DomSanitizer,
    private menuCountsService: MenuCountsService
  ) { }

  async ngOnInit() {
    this.lookupData = this._ActivatedRoute.snapshot.data['data'].lists;
    this.applicationId = this._ActivatedRoute.snapshot.paramMap.get('appId');
    this.executionId = this._ActivatedRoute.snapshot.paramMap.get('id');
    this.state = this._ActivatedRoute.snapshot.paramMap.get('state');
    this.getLocation();
    if (this.executionId !== 'new') {
      await this.getExecutionDetails();
    }
    await this.getApplication();
  }

  // File type detection methods
  isImageFile(filePath: string): boolean {
    if (!filePath) return false;
    const ext = this.getFileExtension(filePath).toLowerCase();
    return ['jpeg', 'jpg', 'webp'].includes(ext);
  }

  isPdfFile(filePath: string): boolean {
    if (!filePath) return false;
    const ext = this.getFileExtension(filePath).toLowerCase();
    return ext === 'pdf';
  }

  isExcelFile(filePath: string): boolean {
    if (!filePath) return false;
    const ext = this.getFileExtension(filePath).toLowerCase();
    return ['xls', 'xlsx', 'xlsm'].includes(ext);
  }

  isPowerPointFile(filePath: string): boolean {
    if (!filePath) return false;
    const ext = this.getFileExtension(filePath).toLowerCase();
    return ['ppt', 'pptx', 'pps'].includes(ext);
  }

  isWordFile(filePath: string): boolean {
    if (!filePath) return false;
    const ext = this.getFileExtension(filePath).toLowerCase();
    return ['doc', 'docx'].includes(ext);
  }

  isOfficeFile(filePath: string): boolean {
    return this.isExcelFile(filePath) || 
           this.isPowerPointFile(filePath) || 
           this.isWordFile(filePath);
  }

  isCsvFile(filePath: string): boolean {
    if (!filePath) return false;
    const ext = this.getFileExtension(filePath).toLowerCase();
    return ext === 'csv';
  }

  isUnsupportedFile(filePath: string): boolean {
    if (!filePath) return false;
    return !this.isImageFile(filePath) && 
           !this.isPdfFile(filePath) && 
           !this.isOfficeFile(filePath) &&
           !this.isCsvFile(filePath);
  }

  getFileExtension(filePath: string): string {
    if (!filePath) return '';
    // Remove query parameters if present
    const pathWithoutQuery = filePath.split('?')[0];
    return pathWithoutQuery.split('.').pop() || '';
  }

  // Zoom methods for images
  zoomIn(): void {
    this.currentScale = Math.min(this.maxScale, this.currentScale + this.scaleStep);
    this.applyImageZoom();
  }

  zoomOut(): void {
    this.currentScale = Math.max(this.minScale, this.currentScale - this.scaleStep);
    this.applyImageZoom();
  }

  resetZoom(): void {
    this.currentScale = 1;
    // Only apply zoom if modal is open
    if (this.showModal) {
      this.applyImageZoom();
    }
  }

  private applyImageZoom(): void {
    const imageElement = document.querySelector('.image-preview') as HTMLElement;
    if (imageElement) {
      imageElement.style.transform = `scale(${this.currentScale})`;
      
      // When zoomed in, make sure the image can be larger than the container
      if (this.currentScale > 1) {
        imageElement.style.maxWidth = 'none';
        imageElement.style.maxHeight = 'none';
      } else {
        imageElement.style.maxWidth = '100%';
        imageElement.style.maxHeight = '100%';
      }
    }
  }

  openModal(event: Event, fileLink: string) {
    event.preventDefault(); // Prevent the default link behavior
    
    // Disable background scrolling
    document.body.style.overflow = 'hidden';
    
    // Store the current file path
    this.currentFilePath = fileLink;
    
    // Reset zoom for images
    this.currentScale = 1;
    
    // Prepare different URLs based on file type
    if (this.isPdfFile(fileLink)) {
      // Add PDF specific parameters
      const pdfUrl = fileLink + "#view=FitH";
      this.sanitizedPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      this.sanitizedImageUrl = null;
    } else if (this.isOfficeFile(fileLink)) {
      // Use Office Online Viewer for Office files
      const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileLink)}`;
      this.sanitizedPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(officeViewerUrl);
      this.sanitizedImageUrl = null;
    } else if (this.isImageFile(fileLink)) {
      this.sanitizedImageUrl = this.sanitizer.bypassSecurityTrustUrl(fileLink);
      this.sanitizedPreviewUrl = null;
    } else if (this.isCsvFile(fileLink)) {
      // Fetch and parse CSV data
      this.fetchCsvData(fileLink);
      this.sanitizedPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileLink);
      this.sanitizedImageUrl = null;
    } else {
      // For other file types, use the regular preview
      this.sanitizedPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileLink);
      this.sanitizedImageUrl = null;
    }
    
    this.showModal = true;
    
    // Wait for the DOM to update before applying zoom
    setTimeout(() => {
      if (this.isImageFile(fileLink)) {
        this.applyImageZoom();
      }
    }, 100);
  }

  closeModal() {
    // Set showModal to false first to remove elements from DOM
    this.showModal = false;
    this.sanitizedPreviewUrl = null;
    this.sanitizedImageUrl = null;
    this.csvHeaders = [];
    this.csvData = [];
    this.currentFilePath = '';
    document.body.style.overflow = 'auto'; // Re-enable background scrolling
    // Don't call resetZoom here as it tries to access DOM elements that are now removed
    this.currentScale = 1;
  }

  // Fetch and parse CSV data
  private fetchCsvData(url: string): void {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(text => {
        this.parseCsvData(text);
      })
      .catch(error => {
        console.error('Error fetching CSV data:', error);
        this.csvData = [['Error loading CSV data']];
      });
  }

  // Parse CSV data
  private parseCsvData(csvText: string): void {
    // Simple CSV parser - for production, consider using a library
    const lines = csvText.split('\n');
    
    if (lines.length > 0) {
      // Assume first line is headers
      this.csvHeaders = this.parseCsvLine(lines[0]);
      
      // Parse data rows
      this.csvData = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          this.csvData.push(this.parseCsvLine(lines[i]));
        }
      }
    }
  }

  // Parse a single CSV line
  private parseCsvLine(line: string): string[] {
    // This is a simple parser that doesn't handle all CSV edge cases
    // For production, consider using a CSV parsing library
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current); // Add the last field
    return result;
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition((r) => {
      this.coords = r.coords;
    }, async () => {
      const res = await this.swalService.warningWithoutCancel('Location Required!',
        'Workflow required your location. Please enable your location and click ok');
      if (res) {
        this.getLocation();
      }
    });
  }

  async getExecutionDetails() {
    try {
      const res: any = await this.workflowService.getExecutionsById(this.executionId);
      this.editDetails = res.data;
    } catch (ex) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    }
  }

  async getApplication() {
    try {
      const res = await this.workflowService.getApplicationById(this.applicationId);
      if (res) {
        this.applicationDetails = res.data || {};
        this.titleService.setTitle(this.applicationDetails.name, this.applicationDetails.shortDescription);
        await this.getApplicationFormDetails();
      } else {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
      }
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async getApplicationFormDetails() {
    try {
      this.spinner.showFull();
      const res = await this.workflowService.getApplicationForm(this.applicationId, this.state !== 'read');
      if (res) {
        this.applicationFormSection = res.data || [];
        for (const ele of this.applicationFormSection) {
          for (const f of ele.applicationFormFields) {
            let lookupDataValues: any = [];
            if (f.lookupId && f.templateName !== constants.lookupListTemplateName.DEPARTMENT) {
              lookupDataValues = await this.configurationService.getAllListDataById(f.lookupId);
            }
            if (f.templateName === constants.lookupListTemplateName.DROPDOWN) {
              lookupDataValues.data.map(data => data.id = data.id.toString());
              f.templateOptions.options = lookupDataValues.data;
              delete f.templateOptions.placeholder;
              f.templateOptions.valueProp = 'id';
              f.templateOptions.labelProp = 'value';
            }
            if (f.templateName === constants.lookupListTemplateName.USERS) {
              const users = await this.configurationService.getallUsers();
              f.templateOptions.options = users.data;
              delete f.templateOptions.placeholder;
              f.templateOptions.valueProp = 'id';
              f.templateOptions.labelProp = 'firstName';
            }
            if (f.templateName === constants.lookupListTemplateName.DEPARTMENT) {
              const users = await this.configurationService.getUserByDepartmentId(f.lookupId);
              f.templateOptions.options = users.data;
              delete f.templateOptions.placeholder;
              f.templateOptions.valueProp = 'id';
              f.templateOptions.labelProp = 'firstName';
            }
            if (f.templateName === constants.lookupListTemplateName.CHECKBOX) {
              f.templateOptions.options = [];
              for (const x of lookupDataValues.data) {
                f.templateOptions.options.push({
                  value: x.value,
                  key: x.id
                });
              }
            }
            if (f.templateName === constants.lookupListTemplateName.FILE) {
              delete f.templateOptions.maxLength;
              f.templateOptions.change = async (field, $event) => { await this.fileChange(field, $event); };
              
              // FILE RESTRICTION ADDITION START
              f.templateOptions.accept = this.allowedMimeTypes.join(',');
              // FILE RESTRICTION ADDITION END
            }
          }
          ele.formlyProp = {
            templateOptionsForm: new FormGroup({}),
            options: {},
            fields: ele.applicationFormFields
          };
        }
        if (this.editDetails) {
          await this.setEditDetails();
        }
        this.isFormBinded = true;
      } else {
        this.toastr.error('error', constants.messages.SERVER_ERROR);
      }
    } catch (err) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async setEditDetails() {
    for (const ele of this.applicationFormSection) {
      for (const f of ele.applicationFormFields) {
        if (this.editDetails) {
          const fieldData = _.find(this.editDetails.applicationExecutionForms, { applicationFormFieldId: f.id });
          if (fieldData) {
            if (f.templateName === constants.lookupListTemplateName.CHECKBOX) {
              const arr = fieldData.value.split(',');
              fieldData.value = {};
              for (const a of arr) {
                fieldData.value[a] = true;
              }
            }
            if (f.templateName === constants.lookupListTemplateName.FILE) {
              this.downloadButtons.push({
                id: f.id,
                name: f.name,
                link: environment.downloadimage + fieldData.value
              });
              this.formFiles[f.id] = fieldData.value;
              f.templateOptions.required = false;
            }
            f.executionDataId = fieldData.id;
            f.defaultValue = fieldData.value;
          }
        }
        if (this.state === 'read') {
          f.templateOptions.disabled = true;
        }
      }
      ele.formlyProp = {
        templateOptionsForm: new FormGroup({}),
        options: {},
        fields: ele.applicationFormFields
      };
    }
    this.spinner.hide();
  }

  async saveApplicationExecutionData(isPublish: Boolean = false) {
    try {
      const data: any = {
        applicationId: this.applicationId,
        applicationExecutionForms: []
      };
      if (this.executionId !== 'new') {
        data.id = this.executionId;
      } else {
        data.latitude = this.coords.latitude;
        data.longitude = this.coords.longitude;
      }
      let isFormValid = true;
      for (const ele of this.applicationFormSection) {
        const frm = ele.formlyProp.templateOptionsForm as FormGroup;
        if (frm.valid) {
          const keys = Object.keys(frm.value);
          for (const key of keys) {
            const field = _.find(ele.applicationFormFields, { key: key });
            let val = frm.value[key].toString();
            if (field.type === 'multicheckbox') {
              const strObj = [];
              const frmValueKeys = Object.keys(frm.value[key]);
              for (const c of frmValueKeys) {
                if (frm.value[key][c]) {
                  strObj.push(c);
                }
              }
              val = strObj.join(',');
            }
            if (this.formFiles[field.id]) {
              val = this.formFiles[field.id];
            }
            const x: any = {
              applicationFormFieldId: field.id,
              value: val,
              fieldId: field.fieldId
            };
            if (field.executionDataId) {
              x.id = field.executionDataId;
            }
            data.applicationExecutionForms.push(x);
          }
        } else {
          isFormValid = false;
        }
      }
      if (isFormValid) {
        this.spinner.showFull();
        const res: any = await this.workflowService.saveWorkflowExecution(this.applicationId, data);
        this.executionId = res.data.id;
        if (isPublish) {
          await this.publish();
        }
        if (res) {
          this.toastr.success('success', constants.messages.EXECUTION_SAVE_SUCCESS);
          this.router.navigate(['/workflow', 'list']);
        }
      } else {
        this.toastr.error('Error', constants.messages.ALL_FIELDS_REQUIRED);
      }
    } catch (ex) {
      this.toastr.error('Error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async fileChange(field, eve) {
    try {
      const fileInput = eve.target; // Get reference to input element
      const f: File = eve.currentTarget.files[0];
      
      // FILE RESTRICTION ADDITION START
      if (!f) return;
      const fileExtension = f.name.split('.').pop().toLowerCase();
      if (!this.allowedExtensions.includes(fileExtension)) {
        this.toastr.error('Error', `Invalid file type. Allowed types are: ${this.allowedExtensions.join(', ')}`);
        
        // Clear input immediately
        fileInput.value = '';
        return; // Stop upload
      }
      // FILE RESTRICTION ADDITION END

      this.spinner.showFull();
      const firstFieldId = this.applicationFormSection[0].applicationFormFields[0].id;
      const firstFieldInputName = this.applicationFormSection[0].applicationFormFields[0].fieldId;
      const firstFieldFormValue = this.applicationFormSection[0].formlyProp.templateOptionsForm.value[firstFieldInputName];
      const res: any = await this.fileUploadService.postExecutionFile(f, {
        applicationId: this.applicationId,
        formFieldId: field.id,
        firstFieldId: firstFieldId,
        firstFieldInputName: firstFieldInputName,
        firstFieldFormValue: firstFieldFormValue
      });
      if (res) {
        this.formFiles[field.id] = res.data.fileKey;
        _.remove(this.downloadButtons, { id: field.id });
        this.downloadButtons.push({
          id: field.id,
          name: field.name,
          link: environment.downloadimage + res.data.fileKey
        });
      }
    } catch (ex) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async publishExecution() {
    try {
      const { value: alertRes } = await this.swalService.warning(`Publish ${this.applicationDetails.name}`,
        constants.messages.PUBLISH_EXECUTION_WARNING);
      if (!alertRes) {
        return;
      }
      this.spinner.showFull();
      await this.publish();
    } catch (ex) {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async publish() {
    const res: any = await this.workflowService.publishExecution(this.applicationDetails.id, this.executionId);
    if (res && res.data) {
      this.router.navigate(['/workflow', 'list']);
      this.menuCountsService.refreshCounts();
      this.toastr.success('success', constants.messages.PUBLISH_SUCCESS);
    } else {
      this.toastr.error('error', constants.messages.SERVER_ERROR);
    }
  }
}