# Safe Inputs GraphQL API 

A GraphQL API used to verify that data is valid JSON format. 

The idea is that the (potentially dangerous) spreadsheet data extracted by the UI/ other methods is passed to this API. GraphQL is typed so only input (spreadsheet data) matching the data types defined in the schema (JSON) will be successfully passed through.  The okayed data is then published via [NATS](https://nats.io/) messaging system. This API uses the NATS NGS global hosted server from [Synadia](https://synadia.com/ngs). (Though can be demoed locally using their demo server (demo.nats.io)).

The API is found https://safeinputs.alpha.canada.ca/graphql

## Installing dependencies

```bash
$ npm install
```

## Running it

```bash
$ npm start &
```

## Using it
#### Pass spreadsheet to Safe Inputs User Interface:
https://safeinputs.alpha.canada.ca/pagesix 

'Upload' an Excel sheet - the data will be extracted locally on your computer then passed to the API. 

#### GraphiQL: 
Is a user interface provided by the [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) (the GraphQL server provider used in this project) - to visually interact with the API. The hello world is there for testing purposes. JSON spreadsheet data is passed to the verifyJsonFormat mutation. 

https://safeinputs.alpha.canada.ca/graphql
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
 If you have [NATS](https://docs.nats.io/running-a-nats-service/introduction/installation), the NATS [cli](https://github.com/nats-io/natscli) and [nsc](https://docs.nats.io/using-nats/nats-tools/nsc) (the command line tool to edit congfigurations for NATS.io security) installed: (** Working on getting this to work with Docker([(nats-box)](https://github.com/nats-io/nats-box) and [nsc nat-box](https://github.com/nats-io/nsc)) versions - updates to come **)

* Open an account with [Synadia](https://app.ngs.global/accounts/new/free)

* Under 'My keys', copy the curl command to the command line. 

* Add the sheet data service to your account

``` 
nsc add import --account gifted_khorana  --src-account ACJYDWSYGCUK54ISQPOVFVKY3CHS24O7LZKV64TSFWFOYXTQCUSZJH3E --remote-subject sheet_data_service --local-subject sheetData
```
* Run a nats server
```
$ nats-server
```
* Subscribe to the feed.
```
$ nats sub -s nats://connect.ngs.global:4222 "sheetData" 

* 'Upload' a spreadsheet to https://safeinputs.alpha.canada.ca/pagesix and watch it appear in the command line interface. 
