import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SpinnerService } from './admin/helper/services/spinner.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'the-classic-gym-frontend';
  showSpinner = false;
  showFullSpinner = false;

  // ← add a flag to skip reload on initial load
  private firstLoad = true;

  constructor(
    private spinnerService: SpinnerService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router              // ← inject the Router
  ) { }

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

    // ← add this block to reload on every NavigationEnd
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (!this.firstLoad) {
          window.location.reload();
        }
        this.firstLoad = false;
      }
    });
  }
}
