import userModel from '../model/userModel.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import sendActivationMail from './emailService.js';
import tokenService from './tokenService.js';
import userDataModel from '../model/userDataModel.js';
import UserDto from '../dtos/userDto.js';
import ApiError from '../exceptions/apiError.js';

class UserService {
	async registration(email, password, gender, day, month, year, fullname, name) {
		const candidate = await userModel.findOne({ email });
		if (candidate) {
			throw ApiError.BadRequest();
		}
		const hashPassword = await bcrypt.hash(password, 3);
		const activationLink = uuidv4();

		const user = await userModel.create({
			email,
			
		});
		
		await sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`);
		const userData = await userDataModel.create({
			name,
			fullname,
			gender,
			day,
			month,
			year,
			activationLink,
			password: hashPassword,
			userId: user._id,
		});
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({ ...userDto });
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return { ...tokens, user: userDto, data: userData };
	}

	async activate(activationLink) {
		const user = await userModel.findOne({ activationLink });
		if (!user) {
			throw ApiError.BadRequest('Неккоректная ссылка активации');
		}
		user.isActivated = true;
		await user.save();
	}

	async login(email, password) {
		const user = await userModel.findOne({ email });
		const userData = await userDataModel.findOne({ userId: user._id})
		
		if (!user && !userData) {
			throw ApiError.BadRequest('Пользователь с таким email не найден');
		}
	
		const isPassEquals = await bcrypt.compare(password, userData.password);
		if (!isPassEquals) {
			throw ApiError.BadRequest('Неверный пароль');
		}
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({ ...userDto });

		await tokenService.saveToken(userDto.id, tokens.refreshToken);
		return { ...tokens, user: userDto, data: userData };
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken);

		return token;
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError();
		}
		const userData = tokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = await tokenService.findToken(refreshToken);
		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError();
		}
		const user = await userModel.findById(userData.id);
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({ ...userDto });

		await tokenService.saveToken(userDto.id, tokens.refreshToken);
		return { ...tokens, user: userDto };
	}

	async getAllUsers() {
		const users = await userModel.find();
		return users;
	}
}

export default new UserService();
