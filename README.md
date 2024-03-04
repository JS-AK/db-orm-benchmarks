# db-orm-benchmarks for **PostgreSQL 16.x**

### Select data by await Promise.all()
50_000 queries in await Promise.all() ("SELECT email FROM users WHERE users.id = $1") with random users.id

10 separately times

```
┌───────────────────┬───────────────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬──────────┐
│ orm db            │ avg query per sec | 1      │ 2      │ 3      │ 4      │ 5      │ 6      │ 7      │ 8      │ 9      │ 10     │ avg      │
├───────────────────┼───────────────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼──────────┤
│ pg.pool           |  9499             | 5277ms | 5252ms | 5260ms | 5201ms | 5232ms | 5251ms | 5286ms | 5260ms | 5307ms | 5311ms | 5263.7ms |
│ drizzle-orm       |  7798             | 6537ms | 6886ms | 6465ms | 6217ms | 6429ms | 6197ms | 6596ms | 6237ms | 6258ms | 6297ms | 6411.9ms |
│ @js-ak/db-manager |  8859             | 6196ms | 5902ms | 5557ms | 5895ms | 5542ms | 5494ms | 5403ms | 5491ms | 5569ms | 5392ms | 5644.1ms |
│ @prisma/client    |  17647            | 2835ms | 2781ms | 2762ms | 2725ms | 2776ms | 2759ms | 2779ms | 2929ms | 2989ms | 2999ms | 2833.4ms |
│ sequelize         |  7649             | 6986ms | 7278ms | 6555ms | 6346ms | 6402ms | 6248ms | 6541ms | 6393ms | 6288ms | 6331ms | 6536.8ms |
│ typeorm           |  6930             | 6944ms | 6859ms | 7361ms | 7890ms | 7171ms | 7077ms | 7046ms | 7414ms | 7137ms | 7247ms | 7214.6ms |
│ mikro-orm         |  6228             | 8638ms | 8341ms | 7944ms | 7770ms | 8180ms | 7959ms | 7848ms | 7658ms | 8082ms | 7861ms | 8028.1ms |
│ objection.js      |  6563             | 7192ms | 8005ms | 8225ms | 7814ms | 7298ms | 7383ms | 7220ms | 7507ms | 7773ms | 7771ms | 7618.8ms |
│ kysely            |  8012             | 6264ms | 6198ms | 6354ms | 6089ms | 5765ms | 5769ms | 6466ms | 6599ms | 6653ms | 6251ms | 6240.8ms |
└───────────────────┴───────────────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴──────────┘
```

### Select data by await one by one in for loop
50_000 queries in await one by one in for loop ("SELECT email FROM users WHERE users.id = $1") with random users.id

10 separately times

```
┌───────────────────┬───────────────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬──────────┐
│ orm db            │ avg query per sec | 1      │ 2      │ 3      │ 4      │ 5      │ 6      │ 7      │ 8      │ 9      │ 10     │ avg      │
├───────────────────┼───────────────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼──────────┤
│ pg.pool           |  9095             | 5773ms | 5617ms | 5837ms | 5352ms | 5297ms | 5459ms | 5592ms | 5196ms | 5343ms | 5507ms | 5497.3ms |
│ drizzle-orm       |  8183             | 6326ms | 6007ms | 5804ms | 5798ms | 5997ms | 5687ms | 5742ms | 5872ms | 6539ms | 7327ms | 6109.9ms |
│ @js-ak/db-manager |  8701             | 5841ms | 5753ms | 5611ms | 5669ms | 5754ms | 5721ms | 5653ms | 5846ms | 6014ms | 5605ms | 5746.7ms |
│ @prisma/client    |  3383             |15777ms |15167ms |15458ms |15753ms |14514ms |14034ms |14835ms |14464ms |13979ms |13819ms |14780.0ms |
│ sequelize         |  7630             | 7017ms | 6654ms | 6729ms | 6559ms | 6297ms | 6470ms | 6355ms | 6298ms | 6502ms | 6649ms | 6553.0ms |
│ typeorm           |  7053             | 7704ms | 7268ms | 7157ms | 6939ms | 6912ms | 6900ms | 6842ms | 6824ms | 7403ms | 6938ms | 7088.7ms |
│ mikro-orm         |  6364             | 7651ms | 7881ms | 8391ms | 8008ms | 7745ms | 7601ms | 7721ms | 7949ms | 7708ms | 7914ms | 7856.9ms |
│ objection.js      |  7119             | 6928ms | 7478ms | 7645ms | 7206ms | 7116ms | 6857ms | 7156ms | 7009ms | 6425ms | 6413ms | 7023.3ms |
│ kysely            |  8335             | 6174ms | 6305ms | 6131ms | 6004ms | 6119ms | 6172ms | 5940ms | 5731ms | 5696ms | 5713ms | 5998.5ms |
└───────────────────┴───────────────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴──────────┘
```

### Insert data in one transaction
50_000 users

10 separately times

```
┌───────────────────┬───────────────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬──────────┐
│ orm db            │ avg query per sec | 1      │ 2      │ 3      │ 4      │ 5      │ 6      │ 7      │ 8      │ 9      │ 10     │ avg      │
├───────────────────┼───────────────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼──────────┤
│ pg.pool           |  6891             | 7863ms | 7053ms | 6916ms | 7071ms | 7233ms | 7551ms | 7384ms | 7091ms | 7209ms | 7190ms | 7256.1ms |
│ @js-ak/db-manager |  6451             | 7113ms | 7216ms | 6990ms | 8274ms | 7413ms | 7529ms | 7507ms | 8378ms | 8711ms | 8375ms | 7750.6ms |
│ typeorm           |  4456             |11941ms |11036ms |10618ms |11608ms |10982ms |11726ms |10909ms |10951ms |11195ms |11253ms |11221.9ms |
└───────────────────┴───────────────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴──────────┘
```

### Insert data by await Promise.all()
50_000 users

10 separately times

```
┌───────────────────┬───────────────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┬──────────┐
│ orm db            │ avg query per sec | 1      │ 2      │ 3      │ 4      │ 5      │ 6      │ 7      │ 8      │ 9      │ 10     │ avg      │
├───────────────────┼───────────────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼────────┼──────────┤
│pg.pool            |  7798             | 8226ms | 6292ms | 6156ms | 6320ms | 6350ms | 6178ms | 6366ms | 6008ms | 6054ms | 6165ms | 6411.5ms |
│@js-ak/db-manager  |  7120             | 8526ms | 6911ms | 7050ms | 6940ms | 6801ms | 7282ms | 7095ms | 6819ms | 6430ms | 6374ms | 7022.8ms |
│typeorm            |  4599             |12774ms | 10728ms| 10804ms| 10610ms| 10576ms| 10713ms| 10637ms| 10600ms| 10588ms| 10699ms| 10872.9ms|
└───────────────────┴───────────────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴────────┴──────────┘
```
