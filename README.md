# Postman + Newman API testing

## Requirements
- [Postman App](https://www.getpostman.com/downloads/)
- [Node.js](https://nodejs.org/en/)

## Postman App
1. Click 'Import' button (up-left side)
2. Select your env file inside `environment/` folder
3. Import your postman collection file inside `collection/` folder
4. Select your imported environment to use in Postman (dropdown on up-right side)
6. Run collection. 

If there is a `/login` file, click on 'Send' request to refresh token before you run only one specific request. 

## Terminal
1. Open project in terminal
2. Run
```
npm install
```
3. Once `node_modules` are installed you can run scripts using
```
node script.js
```
Only Node.js is needed for this approach.


## Continuous integration
You can implement this testing collection in your docker by running
```
test.sh
```
Only Node.js is needed for this approach.


## Notes
There is a folder `useful_examples`. It contains:
- An example of a CRUD testing flow including a login request.
- An example of node script to use with GCP KMS. In this we are using `gcpHelper.js` in order to access to GCP and decrypt the needed token. 

Don't run any file inside this folder, they are just examples.
