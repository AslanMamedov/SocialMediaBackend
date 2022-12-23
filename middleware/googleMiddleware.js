import GoogleStrategy from 'passport-google-oauth20';
const { Strategy } = GoogleStrategy
import 'dotenv/config'; 
import passport from 'passport';


export const googlePassport = () => {
	passport.use(
		new Strategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: 'http://localhost:5000/api/auth/google/calback',
			},
			function (accessToken, refreshToken, profile, done) {
				// cb(null, profile)
				console.log(profile);
				return done(null, profile);
			}
		)
	);
	
}

passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((user, done) => {
	done(null, user);
});