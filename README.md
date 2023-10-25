# db-orm-benchmarks for **Postgresql**

### await Promise.all()
50_000 queries in await Promise.all() ("SELECT email FROM users WHERE users.id = $1") with random users.id

10 separately times

```
┌───────────────────┬───────────────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬──────────┐
│ orm db            │ avg query per sec | 1      │ 2      │ 3      │ 4      │ 5      │ 6      │ 7      │ 8      │ 9      │ 10     │ avg      │
├───────────────────┼───────────────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼──────────┤
│ pg.pool           │ 10815             | 4734ms | 4633ms | 4684ms | 4602ms | 4741ms | 4520ms | 4809ms | 4495ms | 4456ms | 4560ms │ 4623.4ms │
│ drizzle-orm       │  8440             | 6121ms | 6164ms | 5774ms | 5656ms | 6009ms | 6046ms | 6321ms | 6022ms | 5627ms | 5501ms │ 5924.1ms │
│ @js-ak/db-manager │  9975             | 5408ms | 5098ms | 4994ms | 4910ms | 4890ms | 4851ms | 4947ms | 4844ms | 4776ms | 5405ms │ 5012.3ms │
│ @prisma/client    │ 17071*            | 2931ms | 2855ms | 3000ms | 2950ms | 2809ms | 2792ms | 2827ms | 3061ms | 3362ms | 2702ms │ 2928.9ms │
│ sequelize         │  7900             | 6520ms | 6836ms | 6213ms | 6055ms | 6716ms | 6514ms | 5997ms | 6238ms | 6035ms | 6166ms │ 6329.0ms │
│ typeorm           │  7956             | 6429ms | 6378ms | 6177ms | 6650ms | 6237ms | 6906ms | 6176ms | 6136ms | 5836ms | 5918ms │ 6284.3ms │
│ mikro-orm         │  6189             | 8265ms | 8451ms | 8787ms | 8006ms | 7600ms | 7613ms | 7890ms | 8185ms | 8435ms | 7557ms │ 8078.9ms │
│ objection.js      │  7222             | 7212ms | 7129ms | 6813ms | 6754ms | 6607ms | 6987ms | 7200ms | 7057ms | 6738ms | 6735ms │ 6923.2ms │
│ kysely            │  9855             | 5575ms | 5225ms | 5016ms | 5020ms | 5122ms | 5386ms | 4857ms | 4903ms | 4790ms | 4841ms │ 5073.5ms │
└───────────────────┴───────────────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴──────────┘
* every 3rd-5th prisma's test run failed with
    db-orm-benchmarks\node_modules\@prisma\client\runtime\library.js:123

    PrismaClientKnownRequestError:
    Invalid `prisma.users.findFirst()` invocation: Can't reach database server
```

### await one by one in for loop
50_000 queries in await one by one in for loop ("SELECT email FROM users WHERE users.id = $1") with random users.id

10 separately times

```
┌───────────────────┬───────────────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬──────────┐
│ orm db            │ avg query per sec | 1      │ 2      │ 3      │ 4      │ 5      │ 6      │ 7      │ 8      │ 9      │ 10     │ avg      │
├───────────────────┼───────────────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼──────────┤
│ pg.pool           │ 10485             |  4930ms|  5130ms|  4892ms|  4651ms|  4771ms|  4756ms|  4896ms|  4504ms|  4650ms|  4505ms│  4768.5ms│
│ drizzle-orm       │  8571             |  6669ms|  5804ms|  5548ms|  5527ms|  5583ms|  5058ms|  5447ms|  5908ms|  6260ms|  6531ms│  5833.5ms│
│ @js-ak/db-manager │  9961             |  5357ms|  4882ms|  5082ms|  5246ms|  5003ms|  4904ms|  4809ms|  4886ms|  5163ms|  4863ms│  5019.5ms│
│ @prisma/client    │  3596             | 15253ms| 13857ms| 13628ms| 14165ms| 14803ms| 13998ms| 12951ms| 13965ms| 13033ms| 13373ms│ 13902.6ms│
│ sequelize         │  7966             |  6662ms│  6475ms│  6177ms│  6348ms│  6067ms│  6080ms│  6213ms│  6198ms│  6303ms│  6242ms│  6276.5ms│
│ typeorm           │  8212             |  6406ms|  6420ms|  6108ms|  5919ms|  6088ms|  5964ms|  5876ms|  6041ms|  6158ms|  5909ms│  6088.9ms│
│ mikro-orm         │  6388             |  8014ms|  8055ms|  8307ms|  8229ms|  7434ms|  7535ms|  7621ms|  7836ms|  7608ms|  7635ms│  7827.4ms│
│ objection.js      │  8103             |  7378ms|  6086ms|  6075ms|  5953ms|  5806ms|  6151ms|  5974ms|  6114ms|  6087ms|  6085ms│  6170.9ms│
│ kysely            │  9648             |  5644ms|  5230ms|  5285ms|  5219ms|  5238ms|  5163ms|  5113ms|  4966ms|  5142ms|  4824ms│  5182.4ms│
└───────────────────┴───────────────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴──────────┘
```
