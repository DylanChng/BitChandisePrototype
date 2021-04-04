import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-track-item',
  templateUrl: './track-item.component.html',
  styleUrls: ['./track-item.component.css']
})
export class TrackItemComponent implements OnInit {
  
  theInfo:string = "";
  scannerEnabled: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public scanSuccessHandler($event: any) {
    this.scannerEnabled = false;
    this.theInfo =  $event;

  }

  public enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    this.theInfo = "Place The QR Code Directly To Your Camera.";
  }

}
