var express         = require('express'),                   // Web-server
    app             = express(),                            // Web-server instans
    passport        = require('passport'),                  // Identitetsmellomvare
    LocalStrategy   = require('passport-local').Strategy,   // Login-strategi, brukernavn + passord
    bodyParser      = require('body-parser'),               // Hente form-fields ut av body
    session         = require('express-session');           // Enable session storage

// Brukerdatabase
var users = [{"id":111, "username":"lars", "password":"lars"}];
 
// serialize og unserialize users inn og ut av session objekt
passport.serializeUser(function (user, done) {
    done(null, users[0].id);
});
passport.deserializeUser(function (id, done) {
    done(null, users[0]);
});
 
// passport local strategy for local-login, implementasjon av passordsjekk
passport.use('local-login', new LocalStrategy({passReqToCallback : true},
    function (req, username, password, done) {
        if (username === users[0].username && password === users[0].password) {
            return done(null, users[0]);
        } else {
            return done(null, false, {"message": "User not found."});
        }
    })
);
 
// body-parser for retrieving form data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
 
// initialize passposrt and and session for persistent login sessions
app.use(session({
    secret: "detteErEnHemmeligHet",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());         // initialisere passport
app.use(passport.session());            // knytte passport mot session. Ikke påkrevd
 
function isLoggedIn(req, res, next) {   // teste om bruker er logget inn
    if (req.isAuthenticated())
        return next();
    res.sendStatus(401);
}

app.get("/", function (req, res) {
    res.send("Hello!");
});
 
// api endpoints for login, content and logout
app.get("/login", function (req, res) {
    res.send("<p>Please login!</p><form method='post' action='/login'><input type='text' name='username'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>");
});
app.post("/login", 
    passport.authenticate("local-login", { failureRedirect: "/login"}),
    function (req, res) {
        res.redirect("/content");
});

app.get("/content", isLoggedIn, function (req, res) {
    res.send("Congratulations! you've successfully logged in.");
});
app.get("/logout", function (req, res) {
    req.logout();
    res.send("logout success!");
});
 
// launch the app
app.listen(3030);
console.log("App running at localhost:3030");
