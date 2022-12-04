import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { CommandExecutor } from "../../core/executor/command.executor";
import { FileService } from "../../core/files/file.service";
import { IStreamLogger } from "../../core/handlers/stream-logger.interface";
import { StreamHandler } from "../../core/handlers/stream.handler";
import { PromptService } from "../../core/prompt/prompt.service";
import { FfmpegBuilder } from "./ffmpeg.builder";
import { ICommandExecutorFfmpeg, IFfmpegInput } from "./ffmpeg.interfaces";

export class FfmpegExecutor extends CommandExecutor<IFfmpegInput> {
	private fileService: FileService = new FileService();

	private promptService: PromptService = new PromptService();

	constructor(logger: IStreamLogger) {
		super(logger);
	}

	protected async prompt(): Promise<IFfmpegInput> {
		const width = await this.promptService.input<number>("Ширина", "number");
		const height = await this.promptService.input<number>("Высота", "number");
		const path = await this.promptService.input<string>("Путь для файла", "input");
		const name = await this.promptService.input<string>("Высота", "input");

		return { width, height, path, name };
	}

	protected build({ width, height, path, name }: IFfmpegInput): ICommandExecutorFfmpeg {
		const output = this.fileService.getFilePath(path, name, "mp4");
		const args = new FfmpegBuilder().input(path).setVideoSize(width, height).output(output);

		return { command: "ffmpeg", args, output };
	}

	protected spawn({
		command,
		args,
		output,
	}: ICommandExecutorFfmpeg): ChildProcessWithoutNullStreams {
		this.fileService.deleteFileIsExists(output);

		return spawn(command, args);
	}

	protected processStream(stream: ChildProcessWithoutNullStreams, logger: IStreamLogger): void {
		const handler = new StreamHandler(logger);
		handler.processOutput(stream);
	}
}
