const mongoose=require('mongoose');

main().catch(function(err){
    console.log(`Error while connection with db ${err}`);
})

async function main (){
    mongoose.connect(`mongodb://127.0.0.1:27017/enhanced_autentication_API`);
    // mongoose.connect(`${env.smartConnect_dbURL}`);
}

const db=mongoose.connection;
db.on('error',console.error.bind(console,'Error while eastablish the connection wuth db'));
db.once('open',function(){
    console.log('Connection has eastablished with db!');
})

module.exports=db