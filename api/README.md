# Safe Inputs GraphQL API

TODO: update

This API acts as an extra layer of security for Safe Inputs. It employs LangSec techniques by ensuring that the data-type of the recieved data matches the expected data-type through the use of the GraphQL schema. GraphQL [envelop plugins](https://the-guild.dev/graphql/envelop/plugins) reduce the allowed query complexity and therefore the ability to overwhelm the API. (These will need to be configured for your particular use case.)

## Development

See [here](../README.md#development).
