#Auto Scheduler (temp)
##Required libraries & packages
1. Install [node.js](https://nodejs.org/en/).
2. Install dependency package with npm by running:
`
$ npm install
`


##Install mongodb
link: https://docs.mongodb.org/manual/installation/
`
Make sure you install mongodb before starting node app
`

##Local Host
1. Start the local host server with node.js in debug mode:(MAC)
`
$ DEBUG=app npm start
`(Windows)
`
set DEBUG=app & npm start

`
2. The prototype is hosted at (http://localhost:3000/).
3. End the local host server by interrupting with Ctrl + C.

##RESTful Service

GET versionIDS:
url: ~/schedules/:email/:forVersionID
json: {"email": "example@gmail.com", "forVersionID" : "True"}


