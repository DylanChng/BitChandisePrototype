import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token;
  private currentUser;
  private authListener = new Subject<any>();

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  getToken(){
    return this.token;
  }

  getCurrentUser(){
    return this.currentUser;
  }

  getAuthListener(){
    return this.authListener.asObservable();
  }

  login(credentials: any){

    
    this.http.post("http://localhost:3000/login",{username: credentials.username, password: credentials.password})
      .subscribe(response =>{
        console.log(response);
        
        this.toastr.success(response.message, '', {
          timeOut: 2000,
          extendedTimeOut: 2000,
          positionClass: "toast-top-center",
        });

        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 2000);
      },err =>{
        console.log(err);
        this.toastr.error(err.error.message, '', {
          timeOut: 2000,
          extendedTimeOut: 2000,
          positionClass: "toast-top-center",
        });
      })
      
  }

}
