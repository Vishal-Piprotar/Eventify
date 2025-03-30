import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import 'dotenv/config';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("<h1>Backend Working...</h1>")
})

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
// app.use('/api', registrationRoutes);

const port = process.env.PORT || 6000;
app.listen(port, () => console.log(`Server running on port ${port}`));