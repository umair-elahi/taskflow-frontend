import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-route.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthenticationService } from './authentication.service';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        AuthenticationRoutingModule,
        NgSelectModule
    ],
    declarations: [
        SignInComponent
    ],
    providers: [
        AuthenticationService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthenticationModule {

}
