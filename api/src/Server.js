import express from 'express'
import { createServer } from '@graphql-yoga/node'; // using graphQL yoga (https://the-guild.dev/graphql/yoga-server) here as we found it to be more user friendly than Apollo for the server portion.
import { EnvelopArmor } from "@escape.tech/graphql-armor"; 

// To limit complexity as GraphQL is flexible and allows the ability to hit it with giant queries
// unless that ability is limited. * Will need to adjust these parameters! * (https://escape.tech/graphql-armor/)
const armor = new EnvelopArmor({
  maxDepth:{
    enabled: true,
    n: 2,
  },
  costLimit: {
    enabled: true,
    maxCost: 10,
    // objectCost: 2, // Can adjust costs values of the various query parts - but just using the defaults here
    // scalarCost: 2,
    // depthCostFactor: 1.5,
    // ignoreIntrospection: true,
  },
  maxAliases: 4,
})
const protection = armor.protect()

export function Server({
  schema,
  context = {},
}) {
  const app = express()
  const graphQLServer = createServer({
    schema,
    context,
    maskedErrors: false,
    plugins: [...protection.plugins],
  })

  // Bind GraphQL Yoga to `/graphql` endpoint
  app.use(
    '/', 
    graphQLServer,
  )
  return app
}
