import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
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
  colDate = new Date();


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

    const newItem: Item = {
      itemId: this.theItemId.toString(),
      itemName: formData.value.itemName,
      description: formData.value.description,
      status: formData.value.status,
      remarks: formData.value.remark,
      location: formData.value.location,
      // expiryDate: formData.value.expiryDate,
      // collectionDate: formData.value.collectionDate,
      expiryDate: "27/2/2021",
      collectionDate: "27/3/2021",
    };
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
