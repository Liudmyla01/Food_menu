const express = require('express'),
    app = express(),
    path = require('path');
    port = 3001;
app.listen(port);

app.use(express.static(__dirname,''))

//импорт работает если в джесоне прописан "type": "module"в первой колонке
// import express from 'express'
// import path from 'path/posix';


// const __dirname = path.resolve();
// const app  = express(),
//      PORT = 3001;



// app.get('/', (req,res) =>{
//     res.sendFile(path.resolve(__dirname, 'index.html'))
// })

// app.listen(PORT);

