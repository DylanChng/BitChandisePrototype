import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NodesService } from '../nodes/nodes.service';

@Component({
  selector: 'app-blockchain-view',
  templateUrl: './blockchain-view.component.html',
  styleUrls: ['./blockchain-view.component.css']
})
export class BlockchainViewComponent implements OnInit {

  constructor(private dialog: MatDialog, private nodesService: NodesService) { }

  private nodesSub: Subscription;
  nodesList: any;

  ngOnInit(): void {
    this.nodesService.getAllNodes();
    this.nodesSub = this.nodesService.getUpdatedNodeListObservable()
      .subscribe(nodes => {
        this.nodesList = nodes;
        this.nodesService.testAllNodesConnection(nodes)
      }, err => {
        this.nodesList = []
      })
  }

}
