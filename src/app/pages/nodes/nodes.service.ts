import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { BitchandiseService } from 'app/shared/global-service/bitchandise.service';
import { Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NodesService {

  constructor(private http: HttpClient, private bitchandiseService:BitchandiseService) { 
    this.newNodeListener.pipe(shareReplay(1))
    this.updatedNodeListListener.pipe(shareReplay(1))
  }

  private newNodeListener = new Subject();
  private updatedNodeListListener = new Subject();
  private nodeDataListener = new Subject();
  private nodesList: any = [];
  private nodesStatus: any = [];


  getNewNodeObservableListener(){
    return this.newNodeListener.asObservable();
  }

  getUpdatedNodeListObservable(){
    return this.updatedNodeListListener.asObservable();
  }
  
  getNodeDataListener(){
    return this.nodeDataListener.asObservable();
  }

  getAllNodes(){
    this.http.get<{message:string, nodes: any}>("http://localhost:3000/nodes/getAll")
      .subscribe(nodes => {
          this.nodesList = nodes.nodes;

          this.nodesStatus = []
          for(let i = 0; i < this.nodesList.length; i++){
            this.nodesList[i]["status"] = "PENDING..."
          }

          this.updatedNodeListListener.next(this.nodesList);
          this.testAllNodesConnection(this.nodesList)
      }, err => {
        console.log(err);
        console.log("Cannot get request");
      })
  }

  addNewNode(formData) {
    const newNodeData = {
      nodeName: formData.nodeName,
      nodeURL: formData.nodeURL,
    }

    this.http.get(`${formData.nodeURL}/testcon`)
      .subscribe(response => {
        this.http.get(`http://localhost:3001/testcon`)
          .subscribe(result => {
            this.http.post("http://localhost:3000/nodes/add", newNodeData)
            .subscribe(result => {
              //console.log(result);
              this.newNodeListener.next(result)
              this.http.post(`http://localhost:3001/register-and-broadcast-node`,{newNodeUrl: formData.nodeURL})
                .subscribe(result => {
                    console.log(result);
                })
            },err => {
              this.newNodeListener.next(err)
            })
          },err => {
            this.bitchandiseService.notification("Master node is offline","red");
          })
      },err => {
        this.bitchandiseService.notification("Cant connect to node","red");
        console.log(err);
      })
    
  }

  editNodeDetails(formData, nodeId){ 
    const updatedNodeData = {
      nodeName: formData.nodeName,
      nodeURL: formData.nodeURL,
    }

    this.http.get(`${formData.nodeURL}/testcon`)
    .subscribe(response => {
      this.http.put<{message: string}>("http://localhost:3000/nodes/update/" + nodeId,updatedNodeData)
      .subscribe(response => {
        response["updatedNode"] = {
          id: nodeId,
          nodeName: formData.nodeName,
          nodeURL: formData.nodeURL,
        }
        this.newNodeListener.next(response)
        
      }, err => {
        this.newNodeListener.next(err)
      })
    },err => {
      this.bitchandiseService.notification("Cant connect to node","red");
      console.log(err);
    })
  }

  deleteNode(deleteNode){
    this.http.get(`${deleteNode.nodeURL}/testcon`)
      .subscribe(response => {
        
        //Delete from all nodes
        this.http.post("http://localhost:3001/unregister-nodes-broadcast", {nodeUrl: deleteNode.nodeURL})
          .subscribe(response => {
            //Delete from db
            this.http.delete<{message: string}>("http://localhost:3000/nodes/delete/" + deleteNode._id)
             .subscribe(response => {  
              this.bitchandiseService.notification(response.message)
              this.nodesList = this.nodesList.filter(node => {          
                if(node._id !== deleteNode._id) return node;
              })

              this.updatedNodeListListener.next(this.nodesList)
            },err => {
              this.bitchandiseService.notification(err.error.message,"red")
            })
          },err => {
            console.log(err);
          })

        
    },err => {
      this.bitchandiseService.notification("Cant connect to node","red");
      console.log(err);
    })
  }

  initNode(node){
    if(node.status === "CONNECTED") {
      this.bitchandiseService.notification("The node is already online","red")
      return;
    }
    this.http.post("http://localhost:3000/nodes/execute", node)
      .subscribe((response:any) => {
        console.log(response);
        if(response.message === "Blockchain connection sucessful"){
          this.bitchandiseService.notification(response.message)
          for(let i=0; this.nodesList; i++){
            if(this.nodesList[i].nodeName === node.nodeName){
              this.nodesList[i].status = "CONNECTED"
              break;
            }
          }
        }else{
          this.bitchandiseService.notification(response.message,"red")
        }
      },err => {
        console.log(err);
        //Not working
        this.bitchandiseService.notification(err.message,"red") 

      }) 
  }

   testAllNodesConnection(nodesList){
           
    for(let i = 0; i < nodesList.length ; i++){
      this.http.get(`${nodesList[i].nodeURL}/testcon`)
        .subscribe(response => {
          this.nodesStatus.push({
            key: nodesList[i].nodeURL,
            status: "CONNECTED"
          })
        }, err => {
          //console.log(err);          
          this.nodesStatus.push({
            key: nodesList[i].nodeURL,
            status: "DOWN"
          })
        })
        .add(() => {
          //console.log(nodesList[i].nodeURL);

          if(this.nodesStatus.length === nodesList.length){            
            for(let i = 0; i < this.nodesList.length; i++){
              for(let j = 0; j < this.nodesStatus.length ;j++){
                if(nodesList[i].nodeURL === this.nodesStatus[j].key){
                  this.nodesList[i]["status"] = this.nodesStatus[j].status;
                }
              }
            }
            this.updatedNodeListListener.next(this.nodesList)
          }
        })
    }
     
  }

  getNodeData(nodeURL){    
    this.http.get(`${nodeURL}/blockchain`)
    .subscribe(response => {
      this.nodeDataListener.next(response)
    }, err => {
      console.log(err);
    })
  }

}
