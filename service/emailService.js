import nodemailer from 'nodemailer';

const sendActivationMail = async (to, link) => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		secure: false,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.STMP_PASSWORD,
		},
	});

	await transporter.sendMail({
		from: process.env.SMTP_USER,
		to,
		subject: 'Активация аккаунта на ' + process.env.API_URL,
		text: '',
		html: `
				<div>
					<h1>Для активации перейлите по ссылке</h1>
					<a href="${link}">${link}</a>
				</div>

			`,
	});
};

export default sendActivationMail;
