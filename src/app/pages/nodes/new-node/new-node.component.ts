import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BitchandiseService } from 'app/shared/global-service/bitchandise.service';
import { Subscription } from 'rxjs';
import { NodesService } from '../nodes.service';

@Component({
  selector: 'app-new-node',
  templateUrl: './new-node.component.html',
  styleUrls: ['./new-node.component.css']
})
export class NewNodeComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<NewNodeComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  , private fb: FormBuilder, private nodesService: NodesService, private bitchandiseService: BitchandiseService) { }

  private newNodeSub: Subscription

  newNodeForm = this.fb.group({
    nodeName: ["",[Validators.required]],
    nodeURL: ["",[Validators.required]],
    blockchainAPIPath: ["",[Validators.required]]
  })

  ngOnInit(): void {
    if(this.data.node){
      this.newNodeForm.patchValue({
        "nodeName": this.data.node.nodeName,
        "nodeURL": this.data.node.nodeURL, 
        "blockchainAPIPath": this.data.node.blockchainAPIPath, 
      })
    }
  }

  formSubmit(){
    const formData = this.newNodeForm.value;    

    //General Validation
    if(this.newNodeForm.status === "INVALID"){
      this.bitchandiseService.notification("Please fill up the form appropriately","red",1500)
      return;
    }

    //Edit Validation
    if(this.data.mode === "Edit"){
      if(this.data.node.nodeName === formData.nodeName && 
         this.data.node.nodeURL === formData.nodeURL &&
         this.data.node.blockchainAPIPath === formData.blockchainAPIPath){
        this.bitchandiseService.notification("No changes was made to the node's details","red",1500)
        return;
      }
    }

    if(this.data.mode === "Add"){      
      this.nodesService.addNewNode(formData);
    }else if(this.data.mode === "Edit"){
      this.nodesService.editNodeDetails(formData, this.data.node._id);
    }
    
    this.newNodeSub = this.nodesService.getNewNodeObservableListener()
      .subscribe((statusData:any)  => {
          if(statusData.status === 401){
            this.bitchandiseService.notification(statusData.error.message, "red", 1500)        
          }else{
            this.bitchandiseService.notification(statusData.message, "green", 1500)
            
            if(this.data.mode === "Add")
              this.dialogRef.close(statusData.newNode)
            else if(this.data.mode === "Edit")
              this.dialogRef.close(statusData.updatedNode)
          }
          this.newNodeSub.unsubscribe();
      })
      
  }
}
