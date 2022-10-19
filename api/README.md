# Safe Inputs GraphQL API 

A simple GraphQL API used to verify that data is valid JSON format. 

The idea is that the spreadsheet data extracted by the UI will be passed to this API
ensuring that the data from the spreadsheet is JSON formatted. GraphQL is typed so only input matching data types set in the schema will be successfully passed through.  The okayed data is then published via NATS messaging system using [Synadia](https://synadia.com/ngs). 

## Installing dependencies

```bash
npm install
```

That's it!

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

or 

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
npm t
```
`
### Testing NATS messaging
Open a new window to run 
```bash
$ node nats_sub
```
Use the API to see that the data matches message. 
## Code audits

The most useful resource for reviewing this code is Google's [nodesecroadmap](https://github.com/google/node-sec-roadmap).
