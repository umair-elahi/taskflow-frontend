import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminAuthDirective } from '../helper/directive/admin-auth.directive';
import { FilterPipe } from '../helper/directive/filter.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [AdminAuthDirective, FilterPipe],
    exports: [AdminAuthDirective, FilterPipe]
})
export class SharedModule { }
