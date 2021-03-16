import { Strategy as JwtStrategy, StrategyOptions as JwtStrategyOpts, ExtractJwt } from "passport-jwt";

const options: JwtStrategyOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "Super_Secret_Key",
  algorithms: ["HS256"]
};

export default passport => {
  passport.use(
    new JwtStrategy(options, function(jwtPayload, done) {
      try {
        const fakeUser = {
          id: 1,
          name: "Picon"
        };
        done(null, fakeUser, { error: false });
      } catch (error) {
        done(error, null, { error: true });
      }
    })
  );
};
