import  express from 'express';
import SubjectsRouter from './routes/subjects';
import cors from 'cors';

const app=express();
const PORT=8000;

app.use(express.json());

app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:['GET','POST','PUT','DELETE'],
    credentials:true,
     
}))

// routers

app.use(`/api/subjects`,SubjectsRouter)

app.get('/',(req,res)=>{
    res.send("hello to classroom API")
})


app.listen(PORT,()=>{
    console.log( `server started http://localhost:${PORT}`);
})