import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { NgForm } from "@angular/forms";
import { ItemService } from "./item.service";
import { Item } from '../../model/item.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Guid } from "guid-typescript";



@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  //QR related
  title = 'app';
  elementType = 'url';
  value = 'Techiediaries';

  //declarations
  minDate = new Date();
  maxDate = new Date();
  expDate = new FormControl();
  colDate = new FormControl();
  //serializedDate = new FormControl((new Date()).toISOString());


  itemList: Item[] = [];
  //subs
  //private itemSub: Subscription;

  columnName: string[] = ['itemId', 'itemName', 'description','status',
   'remarks', 'location','expiryDate', 'collectionDate', 'action'];
  dataSource = new MatTableDataSource<Item>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public theItemId: Guid;

  constructor(public itemService: ItemService) {
    // const today = new Date();
    // const month = today.getMonth();
    // const year = today.getFullYear();

    // this.additem = new FormGroup({
    //   start: new FormControl(new Date(year, month, 13)),
    //   end: new FormControl(new Date(year, month, 16))

    // });
    
  }

  ngOnInit(): void {
      this.itemList = this.itemService.getItems();
      this.dataSource.data = this.itemList;
      console.log(this.dataSource.data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //methods
  recordNewItem(formData: NgForm){
    if(formData.invalid){
      return
    }
    //generate UUID
    this.theItemId = Guid.create();

    // console.log(this.expDate.value.toISOString());
    // console.log(this.colDate.value.toISOString());

    // console.log(this.expDate.value.getDay());
    // console.log(this.expDate.value.getMonth());
    // console.log(this.expDate.value.getFullYear());
    const newItem: Item = {
      itemId: this.theItemId.toString(),
      itemName: formData.value.itemName,
      description: formData.value.description,
      status: formData.value.status,
      remarks: formData.value.remark,
      location: formData.value.location,
      expiryDate: this.expDate.value,
      collectionDate: this.colDate.value,
    };


    console.log(newItem.collectionDate.toLocaleString('default', { month: 'long' }));


    this.itemService.addItem(newItem);
    console.log(newItem);
    alert("Added a New Item.");
    //formData.resetForm();
    this.refreshTable();

  }

  refreshTable(){
    this.paginator._changePageSize(this.paginator.pageSize);
    this.dataSource.paginator = this.paginator;
  }

  generateQR(itemId :Item){
    //<ngx-qrcode [qrc-value]="theItemId"> </ngx-qrcode>
  }
}
