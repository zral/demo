/**
 * Created by lsoraas on 07.09.15.
 */
var readline = require('readline');
var notp = require('notp');
var SHA1 = require("crypto-js/sha1");

var key = 'dette er et hashet passord for en eller annen bruker, eller bare brukernavnet';
var salt = 'Dette er saltet';
var salted = SHA1(key, salt).toString();

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Authenticator code? ", function(answer) {
    var login = notp.totp.verify(answer, salted,{window:2});
    // invalid token if login is null
    if (!login) {
        console.log('Token ikke gyldig');
    } else {
        console.log('Token ok, sync value %s', login.delta);
    }
    rl.close();
    process.exit(1);
});
