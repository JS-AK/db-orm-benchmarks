/* eslint-disable no-console */
import { getConfig } from "../server/config/index.js";

import { start as prepareDataset } from "./prepare-dataset.js";

import { start as benchInsertDataset } from "./bench-insert-dataset.js";
import { start as benchInsertDatasetInTransaction } from "./bench-insert-dataset-in-transaction.js";
import { start as benchSelectOneByOne } from "./bench-select-one-by-one.js";
import { start as benchSelectPromiseAll } from "./bench-select-promise-all.js";

const { data: config, message } = getConfig();

if (!config) {
	process.stderr.write(`${message}\n`);
	process.exit(1);
} else {
	await prepareDataset(config);

	console.log("---Select-Promise.All--------------");
	await benchSelectPromiseAll(config);
	console.log("-----------------------------------");

	console.log("---Select-one-by-one---------------");
	await benchSelectOneByOne(config);
	console.log("-----------------------------------");

	console.log("---Insert-dataset-in-transaction---");
	await benchInsertDatasetInTransaction(config);
	console.log("-----------------------------------");

	console.log("---Insert-dataset------------------");
	await benchInsertDataset(config);
	console.log("-----------------------------------");
}
