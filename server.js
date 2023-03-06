const mongoose=require('mongoose');

const app=require('./app')
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})
const DB=process.env.DATABASE;

const port=process.env.PORT;
// const Tour=require('./models/tourModel')
// console.log("ddf"+process.env.DATABASE);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>{
    console.log('connected to database');
})

app.listen(port,()=>{
    console.log('server is listen on port',port);
})