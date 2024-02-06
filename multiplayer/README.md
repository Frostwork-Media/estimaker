# Deploy

We run one partykit server for our staging and preview branches and one for production. In both cases, you'll need to load to set the SAVE_ENDPOINT env variable before deploying.
The SAVE_ENDPOINT tells the partykit server where to sync changes in the data back to, so in staging it's the staging DB and in production it's the production DB.


### Deploy to Staging

```
pnpm partykit deploy --preview staging --var SAVE_ENDPOINT=""
```


### Deploy to Production

```
pnpm partykit deploy --var SAVE_ENDPOINT=""
```

https://partykit-party.rob-gordon.partykit.dev

https://staging.partykit-party.rob-gordon.partykit.dev
