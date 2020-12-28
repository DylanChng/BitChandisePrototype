import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  hide = true;

  loginForm = this.fb.group({
    username: ["",[Validators.required]],
    password: ["",[Validators.required]]
  });


  ngOnInit(): void {
  
  }

  submitLoginCreds(){
    const formData  = this.loginForm.value;

    console.log(formData);
    
  }
}
