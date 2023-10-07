db-orm-benchmarks

50_000 queries in await Promise.all() ("SELECT email FROM users WHERE users.id = $1") with random users.id

```
orm db               execTime: 1      2      3      4      5      6      7      8      9      10       avg

pg.pool              execTime: 4488ms 4494ms 4291ms 4464ms 4378ms 4337ms 4354ms 4363ms 4322ms 4334ms   4382.5ms
drizzle-orm          execTime: 5203ms 5292ms 5120ms 5200ms 5169ms 5263ms 5178ms 5163ms 5218ms 5192ms   5199.8ms
@js-ak/db-manager    execTime: 4530ms 4799ms 4776ms 4519ms 4616ms 4498ms 4422ms 4488ms 4494ms 4495ms   4563.7ms
@prisma/client       execTime: 1875ms 1905ms 1928ms 1834ms 1909ms 1848ms 1836ms 1921ms 1847ms 1829ms   1873.2ms
sequelize            execTime: 5570ms 5419ms 6239ms 6186ms 5653ms 5776ms 6088ms 5811ms 6113ms 6070ms   5892.5ms
```
