import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BitchandiseService } from 'app/shared/global-service/bitchandise.service';
import { Subscription } from 'rxjs';
import { ManufacturerService } from '../manufacturer.service';

@Component({
  selector: 'app-new-manufacturer',
  templateUrl: './new-manufacturer.component.html',
  styleUrls: ['./new-manufacturer.component.css']
})
export class NewManufacturerComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<NewManufacturerComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  , private fb: FormBuilder, private manufacturerService: ManufacturerService, private bitchandiseService: BitchandiseService) { }

  private newManufacturerSub: Subscription
  hide = true;

  newManufacturerForm = this.fb.group({
    manufacturerName:["",[Validators.required]],
    username: ["",[Validators.required]],
    password: ["",[Validators.required]],
  })

  ngOnInit(): void {
  }

  togglePasswordField(){
    this.hide = !this.hide;
  }

  formSubmit(){
    const formData = this.newManufacturerForm.value;

    //General Validation
    if(this.newManufacturerForm.status === "INVALID"){
      this.bitchandiseService.notification("Please fill up the form appropriately","red",1500)
      return;
    }

    this.manufacturerService.registerUser(formData);
    this.newManufacturerSub = this.manufacturerService.getNewManufacturerListener()
      .subscribe((statusData:any) => {
        if(statusData.status === 401){
          this.bitchandiseService.notification(statusData.error.message, "red", 1500)        
        }else{
          this.bitchandiseService.notification(statusData.message, "green", 1500)
          this.dialogRef.close(statusData.newManufacturer)
        }

        this.newManufacturerSub.unsubscribe()
      })
    }

}
