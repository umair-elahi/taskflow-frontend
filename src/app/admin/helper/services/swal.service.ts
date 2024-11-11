import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { constants } from '../constants';

@Injectable()
export class SwalService {

    constructor() { }

    deleteWarningPopup() {
        return Swal({
            title: constants.messages.DELETE_WARNING_TITLE,
            text: constants.messages.DELETE_WARNING_TEXT,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        });
    }

    warning(title: string = 'Confirmation', message: string = 'Are you sure?') {
        return Swal({
            title: title,
            text: message,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        });
    }

    warningWithoutCancel(title: string = 'Confirmation', message: string = 'Are you sure?') {
        return Swal({
            title: title,
            text: message,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK',
            cancelButtonText: 'No'
        });
    }
}
