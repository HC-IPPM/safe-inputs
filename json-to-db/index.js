import 'dotenv/config'
import { connect, JSONCodec, jwtAuthenticator } from 'nats';

// NATS variables
const jwt = process.env.NATS_JWT  // expected NATS_JWT value stored .env if running locally or as kubernetes secret env variable
const NATS_URL = "tls://connect.ngs.global:4222"  // Synadia's NATS server (https://app.ngs.global/)
const jc = JSONCodec(); // for decoding NATS messages

// Connect to NATS server using jwt authentication 
const nc = await connect({ 
  servers: NATS_URL, 
  authenticator: jwtAuthenticator(jwt),
});

// Subscribe and listen to the 'sheetData' service
const sub = nc.subscribe("sheetData");
console.log('🚀 Connected to NATS server...');

(async () => {
  // listen for messages, then parse out just the metadata from the top portion of https://safeinputs.alpha.canada.ca/pagesix
  // as well as the extracted spread data
  // TODO - do something with this data! like dump in a db and email notificaiton / email the whole thing/ or throw it up in a collab notebook
  for await (const message of sub) {
    var wholePayload  = jc.decode(message.data)
    if (wholePayload.state == 'DONE') {
      const metaData = wholePayload.workbook.Props
      const content = JSON.stringify(wholePayload.sheets)
      console.log(
        'metadata ', metaData, 
        '\n content ', content,
      )
    }

  console.log("subscription closed");
    }
})();

// don't exit until the client closes
await nc.closed();

