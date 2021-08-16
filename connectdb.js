const MongoClient = require('mongodb').MongoClient;
const importKey = require('./config').key;

async function main(){
    const uri = importKey.mongoDB;

    //create instance of MongoClient
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        await client.connect();
        
        await listDataBases(client);
    }
    catch(e){
        console.error(e);

    }
    finally{
        await client.close();
    }
}

async function listDataBases(client){
    console.log(client.isConnected()); // true
    db = client.db("sample_analytics");
    var results = db.collection("accounts").find({});
    await results.forEach(row => { // awaits until results are given before MongoClient Closes
        console.log(row);
    
    console.log("Databases:");});
}

main().catch(console.error);