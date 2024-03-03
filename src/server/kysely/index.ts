import { fileURLToPath } from "url";
import { fork } from "child_process";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Config = { host: string; port: number; user: string; password: string; database: string; };

export const benchSelect = async (queryCount: number, config: Config): Promise<number> => {
	return new Promise((resolve, reject) => {
		const child = fork(path.join(__dirname, "./child-bench-select.js"));

		child.on("message", (message: number) => {
			child.kill();

			resolve(message);
		});
		child.on("error", (err) => reject(err));
		child.on("exit", (code) => {
			if (code !== 0) {
				reject(new Error(`Child process exited with code ${code}`));
			}
		});

		child.send({ queryCount, config });
	});
};

export const benchSelectOneByOne = async (queryCount: number, config: Config): Promise<number> => {
	return new Promise((resolve, reject) => {
		const child = fork(path.join(__dirname, "./child-bench-select-one-by-one.js"));

		child.on("message", (message: number) => {
			child.kill();

			resolve(message);
		});
		child.on("error", (err) => reject(err));
		child.on("exit", (code) => {
			if (code !== 0) {
				reject(new Error(`Child process exited with code ${code}`));
			}
		});

		child.send({ queryCount, config });
	});
};
