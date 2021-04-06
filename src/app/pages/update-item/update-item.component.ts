import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { NgForm } from "@angular/forms";
import { ItemService } from "../add-item/item.service";
import { Item } from '../../model/item.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Guid } from "guid-typescript";

import { AuthService } from 'app/auth/auth.service';
import { NodesService } from '../nodes/nodes.service';

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.css']
})
export class UpdateItemComponent implements OnInit {
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

  constructor(public itemService: ItemService, private nodesService: NodesService, private authService:AuthService) {
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
      comment: formData.value.comment,
      location: formData.value.location,
      expiryDate: this.expDate.value,
      collectionDate: this.colDate.value,
      madeBy: this.authService.getCurrentUser().toString(),
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
