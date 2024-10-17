// const express = require('express')
// const dotenv = require('dotenv')
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import connectToMongoDB from './db/connectToMongoDB.js';
import userRoutes from './routes/user.route.js'
const app = express()


const PORT = process.env.PORT || 5001
dotenv.config()
app.use(express.json()) //To Parse the incoming request with JSONs Payloads (from req.body)  
app.use(cookieParser())

app.use('/api/auth', authRoutes )
app.use('/api/messages', messageRoutes )
app.use('/api/users', userRoutes )
// app.get('/', (req,res) => {
//     // root rote http://localhost:5001
//      res.send('Hello World')
// })


app.listen(PORT, ()=> 
    {
        connectToMongoDB()
        console.log(`Server running on port ${PORT}`)
    }
)