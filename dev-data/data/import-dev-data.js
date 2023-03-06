const mongoose=require('mongoose')
const dotenv=require('dotenv')
const fs=require('fs')
const Tour=require('./../../models/tourModel')
 


dotenv.config({path:'./config.env'})

const DB=process.env.DATABASE

mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true
})
.then(()=>{
    console.log('connected to database');
})

const tours=fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8');

const importData=async()=>{
    try{
        await Tour.create(JSON.parse(tours))
        console.log('data successfully loaded!!');
        
    }catch(err){
        console.log(err);

    }
    process.exit();
}

//delete all data from collection
const deleteData=async()=>{
    try{
        await Tour.deleteMany();
        console.log('data deleted');
        
    }catch(err){
        console.log(err);
    }
    process.exit();
}
if(process.argv[2]==='--import'){
    importData();
}else if(process.argv[2]==='--delete'){
    deleteData();
}
console.log(process.argv);