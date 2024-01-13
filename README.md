
## DJED Stablecoin Dashboard

This is a dashboard displaying realtime information about the Djed protocol. It is currently hosted on djed-dashboard.vercel.app and will soon move to www.djed-dashboard.com. 

### Backend

A serverless function (hosted on DigitalOcean) regular updates a Firebase realtime database with the smart contract data. This data includes ada reserves, djed and shen reserves, timestamp, block and ada price. With this information, the remaining stats can be calculated. All calculations are based on the minimal Djed implementation from the Djed whitepaper. 

### Frontend

A Next.js app is hosted on Vercel. The app has no active backend, or api, and it is powered with a REST connection to the database. 