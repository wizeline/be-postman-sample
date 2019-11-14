// use newman
let newman = require('newman');

// if you want to inject information to the environment JSON you should use this library. Uncomment if you using env vars in CI
// let fs = require('fs');

// Uncomment if you using env vars in CI. Add 'URL' and 'PROJECT_NAME' as environment variables
// const url = process.env.URL;
// const environment = process.env.PROJECT_NAME;
// const isDev = environment === "dev"; 
// const isQA = environment === "qa";

// console.log(`ENV: ${environment} - URL: ${url}`); // Uncomment if you using env vars in CI

// skipping test if it's on prod. Uncomment if you using env vars in CI
// if(!isDev && !isQA) {
//     console.log('Skipping tests...');
//     process.exit(0);
// }

console.log('Running tests...');

// injecting url to postman json env from CI env variables (you can do the same for any other variable/protected field). Uncomment if you using env vars in CI
// let myVariables=JSON.parse(fs.readFileSync('./environment/qa.postman_environment.json').toString());
// myVariables.values[0].value=url;

newman.run({
    collection: './collection/CountryCollectionExample.postman_collection.json',
    // environment: myVariables, // if you are injecting info to the environment, then use this.
    environment: './environment/qa.postman_environment.json', // this takes the JSON env as it is
    reporters: 'cli',
    bail: true
}, function (error, summary) {
    if (summary.run.failures.length > 0) {
        process.exit(1);
    }
});
