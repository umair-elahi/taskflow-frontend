import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toast: ToastrService) { }

  error(title: string, message: string) {
    this.toast.error(message, title);
  }

  success(title: string, message: string) {
    this.toast.success(message, title);
  }

  warning(title: string, message: string) {
    this.toast.warning(message, title);
  }

  info(title: string, message: string) {
    this.toast.info(message, title);
  }
}
