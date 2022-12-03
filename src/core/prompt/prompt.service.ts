import inquirer from "inquirer";
import { TPromptType } from "./prompt.types";

export class PromptService {
	public async input<T>(message: string, type: TPromptType) {
		const { result } = await inquirer.prompt<{ result: T }>([
			{
				type,
				name: "result",
				message,
			},
		]);

		return result;
	}
}
