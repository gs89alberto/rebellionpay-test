# Backend Technical Test 2022
## Description

The main goal of this Test is to create a Microservice with NestJS who is connected to a NATS and a Database. Microservice and NATS are dockerized and connected with a MongoDB database.

You should add .env file in root folder with two values: "MONGO_DB_URL" and "MONGO_DB_URL_TEST" assigning them database url values. Example: MONGO_DB_URL=mongodb+srv://ms-geolocation:`password`@cluster0.c4h03.mongodb.net/`databaseName`?retryWrites=true&w=majority.

To test the microservice we can run jest test or we can do it manually with [Nats-cli](https://github.com/nats-io/natscli).

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start:dockerdev

# production mode
$ npm run start:dockerprod
```

## Test

```bash
# unit tests
$ npm run test
```

## Test manually with nats-cli

You should install [Nats-cli](https://github.com/nats-io/natscli). Follow instruction in its own [site](https://github.com/nats-io/natscli).

Then try this sample commands:

* Open nats-cli instance for listening(subcribing) all the messages on the server:

```bash
$ nats sub ">"
```

* Open another nats-cli instance for sending messages:

```bash
# To seed DB, with value of 1 means you want to seed that collection otherwise ignore it.
$ nats pub seed "{\"geolocations\":\"1\", \"users\":\"1\"}"

# To publish a position message(for ms stores the position in db).
$ nats pub position "{\"msg\": \"position\",\"user\": \"1\",\"coordinates\": [40.43214797890213,-3.6864397129075717]}"

# To request near users.
$ nats request near "{\"data\":{\"msg\": \"near\",\"user\": \"6208eb9b5c4d2008c0f73582\",\"coordinates\": [40.43214797890213,-3.6864397129075717],\"startDate\": \"2022-02-14T11:02:56.218+00:00\",\"endDate\": \"2022-02-16T22:09:56.218+00:00\"}, \"id\":\"myId\"}"
```

* An example of a request response:

```bash
Received on "_INBOX.ubOe0AWrVrF8mUNBNG9qHU.b18ipC7u" rtt 162.9366ms
{"response":[{"user":[{"_id":"3","name":"userTest3","createdAt":"2022-02-16T11:21:43.515Z","updatedAt":"2022-02-16T11:21:43.515Z"}],"distance":0},{"user":[{"_id":"2","name":"userTest2","createdAt":"2022-02-16T11:21:43.514Z","updatedAt":"2022-02-16T11:21:43.514Z"}],"distance":6.703618820194785},{"user":[{"_id":"1","name":"userTest1","createdAt":"2022-02-16T11:21:43.514Z","updatedAt":"2022-02-16T11:21:43.514Z"}],"distance":15.535366508714516}],"isDisposed":true,"id":"myId"}
```

## Author

[Alberto González Sánchez](https://github.com/gs89alberto)

