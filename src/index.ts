import  express from 'express';

const app=express();
const PORT=8000;

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("hello to classroom API")
})


app.listen(PORT,()=>{
    console.log( `server started http://localhost:${PORT}`);
})