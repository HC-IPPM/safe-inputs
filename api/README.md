# Safe Inputs GraphQL API 

A GraphQL API used to verify that data is valid JSON format. 

The idea is that the (potentially dangerous) spreadsheet data extracted by the UI/ other methods will be passed to this API ensuring that the data from the spreadsheet is JSON formatted. GraphQL is typed so only input matching the data types defined in the schema will be successfully passed through.  The okayed data is then published via [NATS](https://nats.io/) messaging system. This API uses the NATS NGS global hosted server from [Synadia](https://synadia.com/ngs). (Though can be demoed locally using their demo server (demo.nats.io)).

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
#### GraphiQL 
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

#### Curl
```bash
$ curl -s -H "Content-Type: application/json" -d '{"query":"{hello}"}' localhost:3000 | jq .
{
  "data": {
    "hello": "world!"
  }
}
```

```
$ curl -s -H "Content-Type: application/json" -d '{"query": "mutation { verifyJsonFormat (sheetData: {a:3})}"}' localhost:3000 | jq .
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
1. Run a NATS server:

a) If you have [NATS](https://docs.nats.io/running-a-nats-service/introduction/installation) and the NATS [cli](https://github.com/nats-io/natscli) installed:
```
$ nats-server
```
b) Alternatively use docker NATS [(nats-box)](https://github.com/nats-io/nats-box):
```
$ docker run --rm -it natsio/nats-box:latest
```
2. Subscribe to messages:

a) If trying this out with the nats demo server (no credentials required); before running, change the following in index.js:
* Use NATS_URL = "demo.nats.io:4222".
* Comment out "authenticator: credsAuthenticator(new TextEncoder().encode(creds));".
* Comment out "const creds = await readFile("./nats.creds", { encoding: 'utf8' });". 

Then with the NATS, subscribe to the 'sheetData' subject:
```
$ nats sub -s nats://demo.nats.io:4222 “sheetData”
```
Pass data to the API (see "Using it" section) and watch it appear in the terminal. 

b) If using the ngs server:
** To update soon but...this *should work.
With [nsc](https://docs.nats.io/using-nats/nats-tools/nsc) (the command line tool to edit congfigurations for NATS.io security) installed, import the sheet_data_service exported from the account used in this API:
```
$ nsc add import -i
? pick from locally available exports No
? is the export public? Yes
? src-account public key ACJYDWSYGCUK54ISQPOVFVKY3CHS24O7LZKV64TSFWFOYXTQCUSZJH3E
? remote subject sheet_data_service
? is import a service Yes
? name sheet_data_service
? local subject sheet_data_service
```
Push changes to your nats server.
```
$ nsc push -A
```
Subscribe to the feed. 
```
$ nats sub -s nats://connect.ngs.global:4222 "sheetData" 
```
## Code audits

The most useful resource for reviewing this code is Google's [nodesecroadmap](https://github.com/google/node-sec-roadmap).
