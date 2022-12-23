import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
// import passport from 'passport';
import 'dotenv/config'; 


// controllers
import { registration, login, logout, activate, refresh, getUsers } from '../controllers/authControllers.js'; 
import authMiddleware from '../middleware/authMiddleware.js';

router.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 3, max: 32 }),
	registration
);
router.post('/login', login);
router.post('/logout', logout);
router.get('/activate/:link', activate);
router.get('/refresh',refresh);
router.get('/users', authMiddleware, getUsers);
// router.get('/google', passport.authenticate('google', {scope: ['profile']}));
// router.get(
// 	'/google/calback',
// 	passport.authenticate('google', {
// 		successRedirect: process.env.CLIENT_URL + '/main',
// 		failureRedirect: process.env.CLIENT_URL,
// 	})
// );


export default router;