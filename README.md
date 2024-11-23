# db-orm-benchmarks for **PostgreSQL 16.x**

!NB Prisma connection options for stable work: connection_limit=10 pool_timeout=60

### Select data by await Promise.all()
50_000 queries in await Promise.all() ("SELECT email FROM users WHERE users.id = $1") with random users.id

10 separately times

```
┌───────────────────┬───────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬───────────┐
│ orm db            │ avg query per sec |   1     │   2     │   3     │   4     │   5     │   6     │   7     │   8     │   9     │  10     │ avg       │
├───────────────────┼───────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────────┤
│ pg.pool           | 10004             |  5071ms |  4990ms |  4964ms |  4986ms |  4972ms |  4997ms |  5040ms |  4967ms |  4995ms |  5000ms |  4998.2ms |
│ drizzle-orm       |  8474             |  5902ms |  5837ms |  5835ms |  6110ms |  5863ms |  5857ms |  5902ms |  5993ms |  5859ms |  5849ms |  5900.7ms |
│ @js-ak/db-manager |  9567             |  5264ms |  5258ms |  5215ms |  5214ms |  5177ms |  5233ms |  5225ms |  5216ms |  5212ms |  5249ms |  5226.3ms |
│ @prisma/client    | 16216             |  3223ms |  3099ms |  3073ms |  3074ms |  3042ms |  3048ms |  3063ms |  3077ms |  3038ms |  3097ms |  3083.4ms |
│ sequelize         |  8365             |  5987ms |  5984ms |  5956ms |  6017ms |  5945ms |  5962ms |  5997ms |  5996ms |  5972ms |  5957ms |  5977.3ms |
│ typeorm           |  7687             |  6355ms |  6292ms |  6312ms |  6331ms |  6507ms |  6546ms |  6667ms |  6745ms |  6711ms |  6581ms |  6504.7ms |
│ mikro-orm         |  6765             |  7494ms |  7609ms |  7502ms |  7285ms |  7292ms |  7309ms |  7454ms |  7324ms |  7279ms |  7357ms |  7390.5ms |
│ objection.js      |  7442             |  6818ms |  6677ms |  6667ms |  6725ms |  6821ms |  6676ms |  6691ms |  6732ms |  6679ms |  6699ms |  6718.5ms |
│ kysely            |  9169             |  5513ms |  5431ms |  5422ms |  5424ms |  5452ms |  5394ms |  5530ms |  5453ms |  5432ms |  5482ms |  5453.3ms |
└───────────────────┴───────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴───────────┘
```

### Select data by await one by one in for loop
50_000 queries in await one by one in for loop ("SELECT email FROM users WHERE users.id = $1") with random users.id

10 separately times

```
┌───────────────────┬───────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬───────────┐
│ orm db            │ avg query per sec |   1     │   2     │   3     │   4     │   5     │   6     │   7     │   8     │   9     │  10     │ avg       │
├───────────────────┼───────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────────┤
│ pg.pool           | 12416             |  4211ms |  4057ms |  3981ms |  3914ms |  3931ms |  4045ms |  4218ms |  4011ms |  3958ms |  3944ms |  4027.0ms |
│ drizzle-orm       | 10079             |  5115ms |  5003ms |  4948ms |  4889ms |  4937ms |  4922ms |  4884ms |  4930ms |  4938ms |  5041ms |  4960.7ms |
│ @js-ak/db-manager | 11279             |  4683ms |  4460ms |  4444ms |  4411ms |  4358ms |  4326ms |  4438ms |  4439ms |  4389ms |  4382ms |  4433.0ms |
│ @prisma/client    |  3493             | 15879ms | 13580ms | 14263ms | 14139ms | 14448ms | 14487ms | 14278ms | 14123ms | 14237ms | 13691ms | 14312.5ms |
│ sequelize         |  7607             |  6593ms |  6453ms |  6656ms |  6678ms |  6504ms |  6475ms |  6611ms |  6697ms |  6499ms |  6564ms |  6573.0ms |
│ typeorm           |  7878             |  6487ms |  6340ms |  6355ms |  6436ms |  6281ms |  6313ms |  6299ms |  6338ms |  6282ms |  6333ms |  6346.4ms |
│ mikro-orm         |  5594             |  8769ms |  8815ms |  9159ms |  8771ms |  8711ms |  8727ms |  9190ms |  8951ms |  8806ms |  9480ms |  8937.9ms |
│ objection.js      |  9673             |  5353ms |  5227ms |  5125ms |  5342ms |  5168ms |  5096ms |  5055ms |  5044ms |  5142ms |  5137ms |  5168.9ms |
│ kysely            | 11718             |  4402ms |  4146ms |  4169ms |  4368ms |  4375ms |  4427ms |  4118ms |  4221ms |  4209ms |  4235ms |  4267.0ms |
└───────────────────┴───────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴───────────┘
```

### Insert data in one transaction
50_000 users

10 separately times

```
┌───────────────────┬───────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬───────────┐
│ orm db            │ avg query per sec |   1     │   2     │   3     │   4     │   5     │   6     │   7     │   8     │   9     │  10     │ avg       │
├───────────────────┼───────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────────┤
│ pg.pool           |  7780             |  9969ms |  6056ms |  6055ms |  6032ms |  6005ms |  6043ms |  6113ms |  5988ms |  6006ms |  5998ms |  6426.5ms |
│ drizzle-orm       |  6058             | 11109ms |  7856ms |  7818ms |  7888ms |  7745ms |  8470ms |  7854ms |  7951ms |  7945ms |  7905ms |  8254.1ms |
│ @js-ak/db-manager |  7125             | 10915ms |  6805ms |  6814ms |  6590ms |  6484ms |  6648ms |  6424ms |  6480ms |  6582ms |  6433ms |  7017.5ms |
│ @prisma/client    |  2555             | 23968ms | 19250ms | 19387ms | 19551ms | 18301ms | 19625ms | 19286ms | 18647ms | 18824ms | 18846ms | 19568.5ms |
│ sequelize         |  4113             | 15233ms | 11571ms | 11787ms | 11713ms | 11962ms | 12146ms | 11992ms | 11681ms | 11778ms | 11702ms | 12156.5ms |
│ typeorm           |  5962             | 11871ms |  8024ms |  7893ms |  8023ms |  8004ms |  8216ms |  7896ms |  8025ms |  7930ms |  7979ms |  8386.1ms |
│ mikro-orm         |  6128             | 11250ms |  7788ms |  7769ms |  7633ms |  7607ms |  7735ms |  8554ms |  7814ms |  7708ms |  7735ms |  8159.3ms |
└───────────────────┴───────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴───────────┘
```

### Insert data by await Promise.all()
50_000 users

10 separately times

```
┌───────────────────┬───────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬───────────┐
│ orm db            │ avg query per sec |   1     │   2     │   3     │   4     │   5     │   6     │   7     │   8     │   9     │  10     │ avg       │
├───────────────────┼───────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───────────┤
│ pg.pool           |  8895             |  7313ms |  5375ms |  5398ms |  5438ms |  5727ms |  5356ms |  5441ms |  5411ms |  5353ms |  5397ms |  5620.9ms |
│ drizzle-orm       |  4066             | 14393ms | 11853ms | 12183ms | 12304ms | 12482ms | 11810ms | 12011ms | 12081ms | 11824ms | 12038ms | 12297.9ms |
│ @js-ak/db-manager |  8113             |  7777ms |  5895ms |  5894ms |  5946ms |  6310ms |  6020ms |  6015ms |  5883ms |  5936ms |  5957ms |  6163.3ms |
│ @prisma/client    |  9563             |  7625ms |  5014ms |  4844ms |  5416ms |  5026ms |  4957ms |  4846ms |  4874ms |  4891ms |  4792ms |  5228.5ms |
│ sequelize         |  4984             | 12436ms |  9723ms |  9780ms |  9764ms |  9746ms |  9776ms |  9745ms |  9720ms |  9831ms |  9794ms | 10031.5ms |
│ typeorm           |  4950             | 11942ms |  9922ms |  9760ms |  9844ms |  9948ms |  9965ms |  9746ms |  9851ms |  9868ms | 10163ms | 10100.9ms |
│ mikro-orm         |  3812             | 15179ms | 12851ms | 12825ms | 12759ms | 12869ms | 12682ms | 12672ms | 13148ms | 13104ms | 13092ms | 13118.1ms |
└───────────────────┴───────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴───────────┘
```
