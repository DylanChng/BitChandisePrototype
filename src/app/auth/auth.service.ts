import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token;
  private currentUser;
  private authListener = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) { }

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
        this.router.navigate(['/admin']);
      },err =>{
        console.log(err);
      })
      
  }

}
