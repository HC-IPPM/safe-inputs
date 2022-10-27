# Safe Inputs GraphQL API 

A GraphQL API used to verify that data is valid JSON format. 

The idea is that the (potentially dangerous) spreadsheet data extracted by the UI/ other methods will be passed to this API ensuring that the data from the spreadsheet is JSON formatted. GraphQL is typed so only input matching the data types defined in the schema will be successfully passed through.  The okayed data is then published via [NATS](https://nats.io/) messaging system. This API uses the NATS NGS global hosted server from [Synadia](https://synadia.com/ngs). (Though can be demoed locally using their demo server (demo.nats.io)).

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

## Subscribe to and view published data
Run docker NATS [(nats-box)](https://github.com/nats-io/nats-box):
```
docker run --rm -it natsio/nats-box:latest
```
### If trying this out with the nats demo server (with no credentials required), before running:
* Use NATS_URL = "demo.nats.io:4222" in index.js.
* Comment out "authenticator: credsAuthenticator(new TextEncoder().encode(creds));" in index.js.
* Comment out "const creds = await readFile("./nats.creds", { encoding: 'utf8' });" in index.js. 
Then with NATS, subscribe to the 'sheetData' subject:
```
nats sub -s nats://demo.nats.io:4222 “sheetData”
```
Pass data to the API (see previous section) and watch it appear in the PowerShell or terminal. 

### If using the ngs server:
This to come shortly. (As you'll likely need some credentials to subscribe.)
```
nats sub -s nats://connect.ngs.global:4222 "sheetData" 
```
## Code audits

The most useful resource for reviewing this code is Google's [nodesecroadmap](https://github.com/google/node-sec-roadmap).
