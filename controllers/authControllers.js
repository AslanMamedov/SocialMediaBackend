import { validationResult } from 'express-validator';
import ApiError from '../exceptions/apiError.js';
import userService from '../service/userService.js';

const registration = async (req, res, next) => {
	try {  
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
		}
		const { email, password, gender, day, month, year, fullname, name} = req.body;
		const userData = await userService.registration(email, password, gender, day, month, year, fullname, name);
		
		res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
		return res.status(201).json(userData);
	} catch (e) {
		next(e);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const userData = await userService.login(email, password);
		res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
		return res.json(userData);
	} catch (e) {
		res.status(400).json({message: 'Пароль или Электронный адрес не соврподают'})
	}
};

const logout = async (req, res, next) => {
	try {
		const {refreshToken} = req.cookies;
		const token = await userService.logout(refreshToken);
		res.clearCookie('refreshToken');
		return res.json(token);
	} catch (e) {
		next(e);
	}
};

const activate = async (req, res, next) => {
	try {
		const activationLink = req.params.link;
		await userService.activate(activationLink);
		return res.redirect(process.env.CLIENT_URL);
	} catch (e) {
		next(e);
	}
};

const refresh = async (req, res, next) => {
	try {
		const { refreshToken } = req.cookies;
		const userData = await userService.refresh(refreshToken);
		res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
		return res.json(userData);
	} catch (e) {
		next(e);
	}
};

const getUsers = async (req, res, next) => {
	try {
		const users = await userService.getAllUsers();
		return res.json(users);
	} catch (e) {
		next(e);
	}
};


// const registrationGoogle = () => {
	
// }
// const registrationFacebook = () => {

// }

export { registration, login, logout, activate, refresh, getUsers };
