const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');


var password = '12or12';

bcryptjs.genSalt(15,(err,salt) => {
    console.log('salt ',salt)
    bcryptjs.hash(password,salt,(err,encryptedPassword) => {
        console.log(encryptedPassword);
    })
})

// bcryptjs.compare(password,'$2a$15$cbU2u7Jwty10cMNX2uhAAuIjukacg9dyWz3P3zUqsY1kgZXVIWE3W',(err,res) => {
//     console.log('2 ',res)
//    if(err) console.log(err);
// })

//  ======================================================================

// bcryptjs.compare('12or12',)

// var data = {
//     text: 'or moyal madafakasf'
// }

// var token = jwt.sign(data, 'abc123');

// var decodedToken = jwt.verify(token, 'abc123a');


// console.log(token);

// console.log('decodedToken ',decodedToken);


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

//  ======================================================================

// let password = 'Aa123';

// var charset = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
// function crack(value){
//     function toRadix(N,radix) {
//         var HexN = "", 
//             Q = Math.floor(Math.abs(N)), 
//             R,
//             strv = charset,
//             radix = strv.length;

//         while (true) {
//             R = Q % radix;

//             // console.log('Q ',Q);
//             // console.log('strv ',strv);
//             // console.log('radix ',radix);
//             // console.log('R ',R);

//             HexN = strv.charAt(R) + HexN;
//             Q = (Q - R) / radix; 
//             if (Q == 0) 
//                 break;
//         };
//         return ((N < 0) ? "-" + HexN : HexN);
//     };
//     var start = (new Date()) * 1,
//         cracked = false,
//         index = 0;
//     while(!cracked){
//         if(toRadix(index) == value)
//             cracked = true,
//             console.log(toRadix(index));
//         else
//             index++;
//     };
//     console.log(((new Date()) * 1) - start);
// };

// crack(password)