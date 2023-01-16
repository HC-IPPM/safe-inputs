# Safe Inputs GraphQL API 

This API acts as an extra layer of security for Safe Inputs. It employs LangSec techniques by ensuring that the data-type of the recieved data matches the expected data-type through the use of the GraphQL schema.  GraphQL [envelop plugins](https://the-guild.dev/graphql/envelop/plugins) reduce the allowed query complexity and therefore the ability to overwhelm the API. (These will need to be configured for your particular use case.)

This API is very similar to the [node-microservices-demo/api](https://github.com/PHACDataHub/node-microservices-demo/tree/main/api) which has great explainations.  

Once the data passes through the GraphQL API, it's then published via the NATS messaging system. The nats-data-pipeline-demo subscribes to the messages published from this API; ingesting them into a real-time data pipeline proof of concept. 

## Installing dependencies

```bash
$ npm install
```

## Running it

```bash
$ npm start
```

## Using it
#### Pass spreadsheet to Safe Inputs User Interface:
https://safeinputs.alpha.canada.ca/ 

'Upload' an Excel sheet - the data will be extracted locally on your computer then passed to the API. 

#### GraphiQL: 
Is a user interface provided by the [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) (the GraphQL server provider used in this project) - to visually interact with the API. The hello world is there for testing purposes. JSON spreadsheet data is passed to the 'verifyJsonFormat' mutation. 

~~https://safeinputs.alpha.canada.ca/graphql (for the API running on GCP)~~

Or if running locally:

http://localhost:3000/ 
```
{hello}

{
  "data": {
    "hello": "world!"
  }
}
```
```
mutation {
    verifyJsonFormat(sheetData: {a:3})
  }

{
  "data": {
    "verifyJsonFormat": {
      "a": 3
    }
  }
}
```

## Running the tests

```bash
$ npm t
```

## Subscribe to view published data 
(running on demo server for now)

 ~~If you have [NATS](https://docs.nats.io/running-a-nats-service/introduction/installation), the NATS [cli](https://github.com/nats-io/natscli) and [nsc](https://docs.nats.io/using-nats/nats-tools/nsc) (the command line tool to edit congfigurations for NATS.io security) installed: (*Working on getting this to work with Docker([(nats-box)](https://github.com/nats-io/nats-box) and [nsc nat-box](https://github.com/nats-io/nsc)) versions - updates to come*)~~

* ~~Open an account with [Synadia](https://app.ngs.global/accounts/new/free)~~

* ~~Under 'My keys', copy the curl command to the command line.~~ 

* ~~Add the sheet data service to your account~~

~~nsc add import --account gifted_khorana  --src-account ACJYDWSYGCUK54ISQPOVFVKY3CHS24O7LZKV64TSFWFOYXTQCUSZJH3E --remote-subject sheet_data_service --local-subject sheetData~~

* Run a nats server
```
$ nats-server
```
* Subscribe to the feed.

~~$ nats sub -s nats://connect.ngs.global:4222 "sheetData"~~
```
$ nats sub -s nats://demo.nats.io:4222 "safeInputsRawSheetData"
```

* 'Upload' a spreadsheet to https://safeinputs.alpha.canada.ca/ and watch it appear in the command line interface. 
