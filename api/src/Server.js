// import express from 'express'
import { createServer } from 'http'
import { createYoga } from 'graphql-yoga'
import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';
import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';
// Explore https://the-guild.dev/graphql/envelop/plugins for more The Guild pluggins


export function Server({
  schema,
  context = {},
}) {
  const yoga = createYoga({ 
    schema, 
    context, 
    plugins: [
      maxAliasesPlugin({n: 4}), // default 15
      maxDepthPlugin({n: 6}), // Number of depth allowed | Default: 6
    ],
    graphqlEndpoint: '/', 
  })
  const server = createServer(yoga)

  return server
}
  // const app = express()
  // const graphQLServer = createServer({
  //   schema,
  //   context,
  //   maskedErrors: false,
  //   plugins: [...protection.plugins],
  // })

//   // Bind GraphQL Yoga to `/graphql` endpoint
//   app.use(
//     '/', 
//     graphQLServer,
//   )
//   return app
// }
