/**
 * Created by lsoraas on 07.09.15.
 */
var base32 = require('thirty-two');
var SHA1 = require("crypto-js/sha1");
var open = require('open');

var key = 'dette er et hashet passord for en eller annen bruker, eller bare brukernavnet';
var salt = 'Dette er saltet';
var salted = SHA1(key, salt).toString();

// encoded will be the secret key, base32 encoded
var encoded = base32.encode(salted);

// Google authenticator doesn't like equal signs
var encodedForGoogle = encoded.toString().replace(/=/g,'');

// to create a URI for a qr code (change totp to hotp is using hotp)
var uri = 'otpauth://totp/PassportTest?secret=' + encodedForGoogle;

var generate = 'https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl='+uri;

console.log(uri);

open(generate);
