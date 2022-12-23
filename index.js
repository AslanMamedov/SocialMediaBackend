import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import express from 'express';
import 'dotenv/config'; 
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import credentials from './middleware/credentials.js';
// import passport from 'passport';
// import { googlePassport } from './middleware/googleMiddleware.js';
// import session from 'express-session';
//-----------------------------------------------------------
import errorMiddleware from './middleware/errorMiddleware.js';
// Routes
import authRouter from './routes/authRoutes.js'
//-----------------------------------------------------------

import fs from 'fs'


const app = express();
const PORT = process.env.PORT || 8080;
morgan(':method :url :status :res[content-length] - :response-time ms');


//-----------------------------------------------------------
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL,
		// optionsSuccessStatus: 200,
		// allowedHeaders: true
	})
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
// app.use(
// 	session({
// 		secret: 'google',
// 		resave: false,
// 		saveUninitialized: true,
// 	})
// );
// googlePassport();
// app.use(passport.initialize());
// app.use(passport.session());
// Для парсинга cookie
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan('dev'));
// app.use(credentials);

// Для отправки запроса с браузера

app.use(errorMiddleware);





//-----------------------------------------------------------
app.use('/api/auth', authRouter);



//-----------------------------------------------------------


(async () => {
	try {
		mongoose.connect(process.env.DB, {
			dbname: 'liveChat',
		});
		console.log('Connected to Database...');

		app.listen(PORT, () => {
			console.log(`Server was started on the http://localhost:${PORT}`);
		}); 
	} catch (error) {
		throw new Error(error);
	}
})();
