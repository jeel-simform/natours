const fs=require('fs');

const morgan=require('morgan')
const express=require('express')

if(process.env.NODE_ENv==='development'){
    app.use(morgan('dev'))

}

const tourRouter=require('./routes/tourRoutes')
const userRouter=require('./routes/userRoutes')

const app=express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`))



const tours= JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))


app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

// app.get('/api/v1/tours',getAllTours)

// app.get('/api/v1/tours/:id',getTour)

// app.post('/api/v1/tours',createTour)

// app.patch('/api/v1/tours/:id',updateTour)

// app.delete('/api/v1/tours/:id',deleteTour)

module.exports=app;
