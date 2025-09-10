import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "../../prisma/generated/prisma";
import { getSourcePath } from "./env";
import { refreshUnmatchedFiles } from "./tmdb-matcher";

const prisma = new PrismaClient();

const getAllFilesInDir = async (dir: string): Promise<string[]> => {
	console.log("Indexing directory", dir);
	const files: string[] = [];

	try {
		for (const file of await fs.readdir(dir)) {
			if (path.basename(file).startsWith(".")) continue;
			try {
				const fullPath = path.resolve(dir, file);
				const stat = await fs.stat(fullPath);
				if (stat.isDirectory()) {
					files.push(...(await getAllFilesInDir(fullPath)));
				} else {
					console.log("Found file", file);
					files.push(fullPath);
				}
			} catch (err) {
				console.warn("Error reading file", file, err);
			}
		}
	} catch (err) {
		console.warn("Error reading directory", dir, err);
	}

	return files;
};

const addNewFiles = async (files: string[]) => {
	console.log("Creating new files...");
	for (const filePath of files) {
		const existingSourceFile = await prisma.sourceFile.findUnique({
			where: { filePath },
		});
		if (!existingSourceFile) {
			const stat = await fs.stat(filePath);
			console.log("Creating source file", {
				filePath,
				fileSize: stat.size,
				fileType: path.extname(filePath).substring(1),
			});
			await prisma.sourceFile.create({
				data: {
					filePath,
					fileSize: stat.size,
					fileType: path.extname(filePath).substring(1),
				},
			});
		}
	}
};

const markMissingFiles = async (files: string[]) => {
	console.log("Deleting missing files...");

	await prisma.sourceFile.updateMany({
		where: {
			filePath: {
				notIn: files,
			},
			status: {
				not: "Completed",
			},
		},
		data: {
			status: "Missing",
		},
	});
};

export const refreshFiles = async () => {
	const sourcePath = getSourcePath();

	const files = await getAllFilesInDir(sourcePath);
	await addNewFiles(files);
	await markMissingFiles(files);
	console.log("Found files", files);

	await refreshUnmatchedFiles();
};
