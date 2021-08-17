// const express = require('express'),
//     app = express(),
//     port = 3000;
// app.listen(port);


//импорт работает если в джесоне прописан "type": "module"
import express from 'express'
import path from 'path/posix';


const __dirname = path.resolve();
const app  = express(),
     PORT = 3001;

app.use(express.static(__dirname,''))


// app.get('/', (req,res) =>{
//     res.sendFile(path.resolve(__dirname, 'index.html'))
// })

app.listen(PORT);

