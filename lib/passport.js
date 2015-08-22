var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserModel = require(__dirname +'/../model/UserModel');
var FacebookStrategy = require('passport-facebook').Strategy;
var log = require(__dirname + "/log.js");

/*passport.use(new LocalStrategy(function(username, password, done) {
  userModel.findOne({username : username}, function(err,result) {
    if (!result) {
      return done(null, false, {message : 'Incorrect username.'});
    }
    //auth = bcrypt.compareSync(password, result.password);
    //if (!auth) {
    if(password != result.password){
      return done(null, false, {message : 'Incorrect password.'});
    }
    return done(null, result);
  });
}));
*/

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  userModel.findById(id, function(result) {
    done(null, result);
  });
});

passport.use(new FacebookStrategy({
    clientID: "460930247421915",
    clientSecret: "36d04c6f31a4578b0ca32b530ad86a4e",
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    enableProof: false,
    profileFields: ['id', 'displayName', 'gender','email']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(refreshToken,profile,done);
    UserModel.findOne({ facebookId: profile.id }, function (err, user) {
      if(!user){
        var newUserModel = new UserModel({
          displayName:profile.displayName,
          gender:profile.gender,
          facebookId : profile.id,
          email: profile.emails[0].value
        });

        newUserModel.save(function(saveErr){
          return done(err, newUserModel);
        });
      }else{
        return done(err, user);
      }
    });
  }
));

module.exports = passport;