import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BitchandiseService } from 'app/shared/global-service/bitchandise.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  //private token;
  //For Login
  private currentUser;
  private authListener = new Subject<any>();

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService, private bitchandise: BitchandiseService) { }

  /*
  getToken(){
    return this.token;
  }*/

  getCurrentUser(){
    return this.currentUser;
  }

  getAuthListener(){
    return this.authListener.asObservable();
  }

  login(credentials: any){

    
    this.http.post<{message:string}>("http://localhost:3000/login",{username: credentials.username, password: credentials.password})
      .subscribe(response =>{
        console.log(response);
        
        let toastHTMLtemplate = `
        <div class="container-fluid">
          <span data-notify="icon" class="nc-icon nc-bell-55"></span>
          <span data-notify="message">
              ${response.message}
          </span>
        </div>
        `
        this.bitchandise.notification(toastHTMLtemplate,"green",500)

        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 500);
      },err =>{
        console.log(err);

        let toastHTMLtemplate = `
        <div class="container-fluid">
          <span data-notify="icon" class="nc-icon nc-bell-55"></span>
          <span data-notify="message">
              ${err.error.message}
          </span>
        </div>
        `

        this.bitchandise.notification(toastHTMLtemplate,"red",1000)
      })
      
  }
}
