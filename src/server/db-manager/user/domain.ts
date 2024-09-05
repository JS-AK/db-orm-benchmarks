import { PG } from "@js-ak/db-manager";

import * as Types from "./types.js";

import { model } from "./model.js";

export default class Domain extends PG.Domain.BaseTable<PG.Model.BaseTable, {
	CreateFields: Types.CreateFields;
	SearchFields: Types.SearchFields;
	CoreFields: Types.TableFields;
	UpdateFields: Types.UpdateFields;
}> {
}

export const domain = (creds: PG.ModelTypes.TDBCreds) =>
	new Domain({ model: model(creds) });
