const app=require('./app')

const port=process.env.PORT||3000;

app.listen(port,()=>{
    console.log('server is listen on port 3000');
})