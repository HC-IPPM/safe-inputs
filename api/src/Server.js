import express from 'express'
import { createServer } from '@graphql-yoga/node';
import { EnvelopArmor } from "@escape.tech/graphql-armor";

// To limit complexity
const armor = new EnvelopArmor({
  maxDepth:{
    enabled: true,
    n: 2,
  },
  costLimit: {
    enabled: true,
    maxCost: 10,
    // objectCost: 2,
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
