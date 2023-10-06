import fs from "node:fs";
import path from "node:path";

export const walk = async (dirPath: string): Promise<string[]> => {
	const entries = await fs
		.promises
		.readdir(dirPath, { withFileTypes: true });

	const results: string[] = [];

	await Promise.all(
		entries.map(async (entry) => {
			const childPath = path.join(dirPath, entry.name);

			if (entry.isDirectory()) {
				const nestedResults = await walk(childPath);

				results.push(...nestedResults);
			} else {
				results.push(childPath);
			}
		}),
	);

	return results;
};
