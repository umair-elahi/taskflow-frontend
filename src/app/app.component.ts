import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SpinnerService } from './admin/helper/services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'the-classic-gym-frontend';
  showSpinner = false;
  showFullSpinner = false;

  constructor(private spinnerService: SpinnerService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.spinnerService.showSpinner()
      .subscribe((obj) => {
        if (!obj.show) {
          this.showFullSpinner = false;
          this.showSpinner = false;
        } else {
          if (obj.full) {
            this.showFullSpinner = obj.show;
          } else {
            this.showSpinner = obj.show;
          }
        }
        this.changeDetectorRef.detectChanges();
      });
  }
}
