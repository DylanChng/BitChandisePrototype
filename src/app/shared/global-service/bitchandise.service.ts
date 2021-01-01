import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class BitchandiseService {

  constructor(private toastr: ToastrService) { }

  notification(message:string, color: string = "green", duration: number = 2000, position: string = "top-center"){

    let notificationSettings = {
      timeOut: duration,
      positionClass: "toast-" + position,
      enableHtml: true,
      tapToDismiss: true
    }

    /*
    let toastHTMLtemplate = `
    <div class="container-fluid">
      <span data-notify="icon" class="nc-icon nc-bell-55">
      <span data-notify="title">Test</span>
      </span><span data-notify="message">
        Welcome to <b>Paper Dashboard Angular</b> - a beautiful ss dashboard for every web developer.
      </span>
    </div>
    `
    */
    switch (color) {
      case "green":
        this.toastr.success(message, '',notificationSettings);
        break;
      case "red":
        this.toastr.error(message, '', notificationSettings);
        break;
      case "cyan":
        this.toastr.info(message, '', notificationSettings);
        break;
      case "yellow":
        this.toastr.warning(message, '', notificationSettings);
        break;
      case "black":
        this.toastr.show(message, '', notificationSettings);
        break;
      default:
        this.toastr.show(message, '', notificationSettings);
        break;
    }
  }
}
