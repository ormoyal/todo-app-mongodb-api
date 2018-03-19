const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    text: 'or moyal madafakasf'
}

var token = jwt.sign(data, 'abc123');

var decodedToken = jwt.verify(token, 'abc123a');


console.log(token);

console.log('decodedToken ',decodedToken);


// var message = 'or moyal age 20';
// console.log(SHA256(message).toString());

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
// console.log('token.hash ', token.hash);

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();  
// console.log('HACKER.hash ', token.hash);

// var resultHash =  SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// console.log('resultHash', resultHash);

// if(resultHash === token.hash){
//     console.log('data safe');
// }else {
//     console.log('hacker has broke in');    
// }