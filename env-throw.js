const fs = require('fs');

if(process.env.NODE_ENV === "production"){
    const data = "const env = 'prod'; \nmodule.exports = {env: env};"
    fs.writeFile("./client/src/utils/env.js", data, (err) => {
        if(err) throw err;
        console.log('File write success! (prod)');
    });
} else {
    const data = "const env = 'test'; \nmodule.exports = {env: env};"
    fs.writeFile("./client/src/utils/env.js", data, (err) => {
        if(err) throw err;
        console.log('File write success! (test)');
    });
};