var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var dynamoDB = require('./routes/dynamoDB');
var config = require('./config');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);

    try {
        const params = {
            TableName: 'CargoshopUsers',
            Key: {
                username: jwt_payload.username
            }
        };

        const data = await dynamoDB.get(params).promise();

        if (data.Item) {
            return done(null, data.Item);
        } else {
            return done(null, false);
        }
    } catch (err) {
        console.log(err);
        return done(err, false);
    }
}));

exports.getToken = function (user) {
    return jwt.sign({ username: user.username, admin: user.admin }, config.secretKey, { expiresIn: 3600 });
};

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
    if (req.user && req.user.admin) {
        next();
    } else {
        var err = new Error('Apenas administradores podem realizar esta ação!');
        err.status = 403;
        return next(err);
    }
};