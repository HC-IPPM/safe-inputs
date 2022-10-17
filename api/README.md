# Safe Inputs GraphQL API 

A simple GraphQL API used to verify that data is valid JSON format.

## Installing dependencies

```bash
npm install
```

That's it!

## Running it

```bash
$ npm start &
$ curl -s -H "Content-Type: application/json" -d '{"query":"{hello}"}' localhost:3000 | jq .
{
  "data": {
    "hello": "world!"
  }
}
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

## Code audits

The most useful resource for reviewing this code is Google's [nodesecroadmap](https://github.com/google/node-sec-roadmap).
