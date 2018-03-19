var env = process.env.NODE_ENV || 'development';
console.log('**env** ', env);

console.log(`**START of config.js page! ${process.env.MONGODB_URI} PORT: ${process.env.PORT}** `);


if(env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppDB";
}else if(env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppDBtest";
}


console.log(`**end of config.js page! ${process.env.MONGODB_URI} PORT: ${process.env.PORT}** `);
