# json-to-db (sheetData to database)

At this point, the data extracted from the xlsx has been passed though the [GraphQL API](../api/) and published via NATS message.  This json-to-db service picks up this JSON data and then does stuff with it. What that stuff is will depend on feedback recieved by users - please get in touch if you have thoughts! 

* Note this doesn't do anything except print out the data (YET!) 

So for this demo, nothing has been transformed yet - or have flagged differently labelled fields from previously recieved data, etc - at this point, it just subscribes to the NATS subject "sheetData" and will, hopefully soon, insert the data into a database and/ email on to a desired recipient.

#### Note 
This module uses the [node microservervices demo](https://github.com/PHACDataHub/node-microservices-demo) as a template/ framework.


## Installing dependencies

```
npm install
```

## Running it

Note: the system expects a `.env` file in the root of the `json-to-db` floder containing the NATS_JWT value.
```
$ npm start &
```

## Running the tests

```
npm t
```

## Code audits

The most useful resource for reviewing this code is Google's [nodesecroadmap](https://github.com/google/node-sec-roadmap).
