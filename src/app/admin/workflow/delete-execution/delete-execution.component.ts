import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { constants } from '../../helper/constants';
import { SpinnerService } from '../../helper/services/spinner.service';
import { SwalService } from '../../helper/services/swal.service';
import { TitleService } from '../../helper/services/title.service';
import { ToasterService } from '../../helper/services/toaster.service';
import { WorkflowService } from '../workflow.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-execution',
  templateUrl: './delete-execution.component.html',
  styleUrls: ['./delete-execution.component.scss']
})
export class DeleteExecutionComponent implements OnInit {

  applications: any = [];
  statuses: any = constants.executionStatuses;
  rptFilter: any = {
    applicationId: null,
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    status: 'all'
  };

  constructor(
    private workflowService: WorkflowService,
    private sprinnerService: SpinnerService,
    private swalService: SwalService,
    private toastr: ToasterService,
    private titleService: TitleService,
    private router: Router
  ) { }

  async ngOnInit() {

    const userRole = this.getUserRole(); // Your method to get user role

    if (userRole !== 'superAdmin') {
      // Redirect to dashboard if the user is not a superAdmin
      this.router.navigate(['/workflow/dashboard']);
    }

    this.titleService.setTitle('Workflow', 'Delete Executions');
    await this.getApplications();
  }

  getUserRole(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.roles[0];
  }

  private async getApplications() {
    try {
      this.sprinnerService.showFull();
      const res: any = await this.workflowService.getApplications('', '', []);
      if (res && res.data) {
        this.applications = res.data;
      }
    } catch (ex) {
      this.toastr.error('Error', 'Error loading applications');
    } finally {
      this.sprinnerService.hide();
    }
  }

  public async removeData() {
    try {
      const res = await this.swalService.warning('Are you sure?',
        'Once you perform this action all the records according to applied filters will be deleted permanently and no more available');
      if (res && res.value) {
        this.sprinnerService.showFull();
        const r = await this.workflowService.deleteExecutionWithFiles(this.rptFilter);
        if (r) {
          this.toastr.success('Success', 'Records has been deleted');
        } else {
          this.toastr.error('Error', 'Error while deleting records');
        }
      }
    } catch (ex) {
      this.toastr.error('Error', 'Error while deleting records');
    } finally {
      this.sprinnerService.hide();
    }
  }
}
