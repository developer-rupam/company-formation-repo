import { Environment } from "./helpers/Environment";
import { app } from "./app";
import { readFileSync } from 'fs';
import {join} from 'path';
import * as Https from 'https';

async function main() {
  const PORT=Environment.APP_DEV_PORT as string;
  try {
    // serve the API with signed certificate on 443 (SSL/HTTPS) port
    const httpsServer = Https.createServer({
      //cert:readFileSync(join(__dirname,"../","cert","fullchain.pem"),'utf8'),
       //key: readFileSync(join(__dirname,"../","cert","privkey.pem"),'utf8'),
      //key: readFileSync('/home/ukcosmartdoc/public_html/1st-choice-backend/server.key'),
      //cert: readFileSync('/home/ukcosmartdoc/public_html/1st-choice-backend/b3b47f0fe2b15b84.crt'),
      key: readFileSync('/home/ukcosmartdoc/public_html/1st-choice-backend/private.key'),
      cert: readFileSync('/home/ukcosmartdoc/public_html/1st-choice-backend/certificate.crt'),
    }, app);

    httpsServer.listen(PORT, () => {
      console.log('HTTPS Server running on port '+PORT);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

main();
