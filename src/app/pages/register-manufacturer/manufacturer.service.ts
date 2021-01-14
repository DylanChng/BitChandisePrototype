import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BitchandiseService } from 'app/shared/global-service/bitchandise.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  constructor(private http: HttpClient, private bitchandiseService:BitchandiseService) { }

  //For manufacturer page
  private updatedManufacturerListListener = new Subject();
  private newManufacturerListener = new Subject();
  private manufacturerList:any = []

  getNewManufacturerListener(){
    return this.newManufacturerListener.asObservable();
  }

  getUpdatedManufacturerListListener(){
    return this.updatedManufacturerListListener.asObservable();
  }

  getAllManufacturer(){
    this.http.get("http://localhost:3000/manufacturer/get")
      .subscribe((response:any) => {
        this.manufacturerList = response.manufacturers
        console.log(this.manufacturerList);
        this.updatedManufacturerListListener.next(response.manufacturers)
      }, err => {
        console.log(err);
        console.log("Cannot get request");
      })
  }
  
  registerUser(formData){
    this.http.post("http://localhost:3000/manufacturer/register",formData) 
      .subscribe(response => {
          this.newManufacturerListener.next(response);
      }, err => {
          this.newManufacturerListener.next(err);
      })
  }

  deleteUser(manufacturerUsername) {
    this.http.delete<{message: string}>("http://localhost:3000/manufacturer/delete/" + manufacturerUsername)
      .subscribe(response => {
        this.bitchandiseService.notification(response.message)
        this.manufacturerList = this.manufacturerList.filter(manufacturer => {          
          if(manufacturer.username !== manufacturerUsername) return manufacturer;
        })

        this.updatedManufacturerListListener.next(this.manufacturerList)
      },err => {
        this.bitchandiseService.notification(err.error.message,"red")
      })
  }
}
