import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private authService:AuthService) { }

  hide = true;

  loginForm = this.fb.group({
    username: ["",[Validators.required]],
    password: ["",[Validators.required]]
  });


  ngOnInit(): void {
  
  }

  submitLoginCreds(){
    const formData  = this.loginForm.value;
    this.authService.login(formData);
  }
}
