//Express backend server
const express = require('express');
const app = express();
const fs = require('fs')

//Node dependencies
const bodyParser = require('body-parser');
const { v1: uuidv1 } = require('uuid');
const rp = require("request-promise");

//Blockchain related constants
const Blockchain = require('./blockchain.js');
const bitchandise = new Blockchain;
bitchandise.loadChainData();


//http://localhost:3001/blockchain - npm run node_1
//http://localhost:3002/blockchain - npm run node_2
//http://localhost:3003/blockchain - npm run node_3
//http://localhost:3004/blockchain - npm run node_4
//http://localhost:3005/blockchain - npm run node_5


//Blockchain port
const port = process.argv[2];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
    next();
});

//endpoint 1 - fetch entire blockchain
app.get('/blockchain', (req, res) => {
   res.send(bitchandise);
});

app.get('/transaction',(req, res) => {
    let transactions = [];
    bitchandise.chain.forEach(block => {        
        transactions.push(...block.transactions);
    })

    res.send(transactions);
})

//endpoint 2 - create transaction
app.post('/transaction', (req, res) => {
   const blockIndex = bitchandise.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
   res.json({ note: 'Transaction will be added in block ' + blockIndex + '.'});
});

//endpoint 3 - mining a new block
app.get('/mine', (req, res) => {
    const lastBlock = bitchandise.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transaction: bitchandise.pendingTransactions, index: lastBlock['index'] + 1
   };
    //get nonce
    const nonce = bitchandise.proofOfWork(previousBlockHash, currentBlockData);
    //hash the block of data
    const blockHash = bitchandise.hashBlock(previousBlockHash, currentBlockData, nonce);
    //call the mining method 
    const newBlock = bitchandise.createNewBlock(nonce, previousBlockHash, blockHash);

    
    const syncNodesPromises = [];
    bitchandise.networkNodes.forEach(networkNodesUrl => {
        const requestOptions = {
            uri: networkNodesUrl + "/sync-nodes",
            method: "POST",
            body: { 
                nodeUrl: networkNodesUrl,
                newBlock: newBlock,
            },
            json: true
        }
        syncNodesPromises.push(rp(requestOptions));
    })

    Promise.all(syncNodesPromises)
        .then(data => {
            res.json({
                note: "new block mined successfully",
                block: newBlock
            });
        })
    

    

    /* Reward system
        const nodeAddress = uuidv1().split("-").join("");
        console.log(nodeAddress);
        bitchandise.createNewTransaction(12.5,"00",nodeAddress) //reward
    */
});

//endpoint 4 - create new item
app.post('/createItem', (req, res) => {
    const blockIndex = bitchandise.createNewItem(req.body.itemID, req.body.itemName, req.body.description, req.body.location, req.body.status,
         req.body.comment, req.body.expiryDate, req.body.collectionDate);
    res.json({ note: 'Transaction will be added in block ' + blockIndex + '.'});
 });

//register new node and broadcast to other nodes
app.post('/register-and-broadcast-node', (req,res) =>{
    const newNodeUrl = req.body.newNodeUrl;
    const notCurrentNode = bitchandise.currentNodeUrl !== newNodeUrl;
    if(bitchandise.networkNodes.indexOf(newNodeUrl) == -1 && notCurrentNode)
        bitchandise.networkNodes.push(newNodeUrl);
    else if(!notCurrentNode){
        res.json({
            note: "New node is the current node"
        })
        return;
    }else{
        res.json({
            note: "Node is already part of the network"
        })
        return;
    }
    
    const regNodesPromises = [];
    
    //For new node only
    const transactionSyncReq  = {
        uri: newNodeUrl + "/sync-transaction-new-node",
        method: "POST",
        body: {
            transactions: bitchandise.chain
        },
        json: true
    }
    regNodesPromises.push(rp(transactionSyncReq));

    bitchandise.networkNodes.forEach(networkNodesUrl => {
        const requestOptions = {
            uri: networkNodesUrl + "/register-node",
            method: "POST",
            body: { 
                newNodeUrl: newNodeUrl,
            },
            json: true
        }
        //rp(requestOptions)
        regNodesPromises.push(rp(requestOptions));
    })    
    
    Promise.all(regNodesPromises)
        .then(data => {
            const bulkRegisterOptions = {
                uri: newNodeUrl + "/register-nodes-bulk",
                method: "POST",
                body: {
                    allNetworkNodes: [...bitchandise.networkNodes,bitchandise.currentNodeUrl]
                },
                json: true
            }

            return rp(bulkRegisterOptions).then(data => {
                res.json({
                    note: "New Node registered with network successfully"
                })
        })
                
        });
});

//register a single node to the network, NOT STANDALONE
app.post('/register-node', (req,res) =>{
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitchandise.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitchandise.currentNodeUrl !== newNodeUrl;
    if(nodeNotAlreadyPresent && notCurrentNode){
        bitchandise.networkNodes.push(newNodeUrl);
    }else if(!notCurrentNode){
        res.json({
            note: "New node is the current node"
        })
        return;
    }else{
        res.json({
            note: "Node is already part of the network"
        })
        return;
    }

    
    res.json({note: "New node registered successfully. "})
});

//Register a list of nodes for new nodes, NOT standalone
app.post('/register-nodes-bulk',(req,res) =>{
    const allNetworkNodes = req.body.allNetworkNodes;

    allNetworkNodes.forEach(networkNodesUrl => {
        const nodeNotAlreadyPresent = bitchandise.networkNodes.indexOf(networkNodesUrl) == -1;
        const notCurrentNode = bitchandise.currentNodeUrl !== networkNodesUrl;
        if(nodeNotAlreadyPresent && notCurrentNode)
            bitchandise.networkNodes.push(networkNodesUrl)
    })
    
    res.json({
        note: "Bulk registration successfull"
    })
})

//Syncronize new nodes to have the same data with the network
app.post("/sync-transaction-new-node", (req,res) => {
    const allTransactions = req.body.transactions;
    bitchandise.chain = allTransactions;

    res.json({
        note: "Syncronization of blocks with new nodes is successful"
    })
})

//Syncronizes by adding new block to all nodes
app.post("/sync-nodes", (req,res)=> {
    //const nodeUrl = req.body.nodeUrl;
    const newBlock = req.body.newBlock;

    bitchandise.chain.push(newBlock);

    res.json({
        note: "New block added"
    })
})

app.listen(port, () =>{
    console.log(`listening on port ${port}...`);
});
