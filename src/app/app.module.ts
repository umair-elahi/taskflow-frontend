import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material';


// toaster
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './admin/shared/shared.module';

// Spinner
import { SpinnerComponent } from './admin/helper/component/spinner.component';
import { SpinnerService } from './admin/helper/services/spinner.service';
import { FullSpinnerComponent } from './admin/helper/component/full-spinner.component';

// Interceptors
import { EncodeHttpParamsInterceptor } from './admin/helper/interceptors/encode-interceptor';
import { AuthInterceptor } from './admin/helper/interceptors/auth-interceptor';
import { CachingInterceptor } from './admin/helper/interceptors/caching-interceptor';
import { ResponseInterceptor } from './admin/helper/interceptors/response-interceptor';

// Services
import { UserService } from './admin/helper/services/user.service';
import { ToasterService } from './admin/helper/services/toaster.service';
import { SwalService } from './admin/helper/services/swal.service';
import { TitleService } from './admin/helper/services/title.service';
import { RefreshSideMenuService } from './admin/helper/services/refresh-side-menu.service';
import { FileUploadService } from './admin/helper/services/file-upload.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuCountsService } from './admin/helper/services/menu-counts.service';
import { PdfService } from './admin/helper/services/pdf.service';
import { LabelPopupComponent } from './label-popup/label-popup.component';


@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullSpinnerComponent,
    LabelPopupComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    MatProgressBarModule,
    SharedModule
  ],
  entryComponents: [
    LabelPopupComponent // Add this line
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EncodeHttpParamsInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true,
    },
    UserService,
    ToasterService,
    SwalService,
    TitleService,
    RefreshSideMenuService,
    SpinnerService,
    FileUploadService,
    MenuCountsService,
    PdfService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
