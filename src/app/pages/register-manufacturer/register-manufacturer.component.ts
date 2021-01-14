import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'app/auth/auth.service';
import { Subscription } from 'rxjs';
import { ManufacturerService } from './manufacturer.service';
import { NewManufacturerComponent } from "./new-manufacturer/new-manufacturer.component";

@Component({
  selector: 'app-register-manufacturer',
  templateUrl: './register-manufacturer.component.html',
  styleUrls: ['./register-manufacturer.component.css']
})
export class RegisterManufacturerComponent implements OnInit {

  private manufacturerListSub : Subscription;
  manufacturerList: any[];

  constructor(private dialog: MatDialog, private authService: AuthService, private manufacturerService: ManufacturerService) { }

  ngOnInit(): void {
    this.manufacturerService.getAllManufacturer();
    
    this.manufacturerListSub = this.manufacturerService.getUpdatedManufacturerListListener()
      .subscribe((manufacturerList:any) => {
          this.manufacturerList = manufacturerList
      }, err => {
        this.manufacturerList = []
      })
  }

  onRegisterManufacturer(){
    const regManuDialogRef = this.dialog.open(NewManufacturerComponent, {
      width: "90%",
      maxWidth: "400px",
      height: "auto",
      maxHeight: "450px",
      closeOnNavigation: true,
      disableClose: true
    })

    regManuDialogRef.afterClosed().subscribe(newManufacturer => {
      if(newManufacturer) this.manufacturerList.push(newManufacturer)
    })
  }

  onDeleteManufacturer(manufacturerData){
    this.manufacturerService.deleteUser(manufacturerData);
  }
}
