import type { SourceFile } from "../../prisma/generated/prisma";
import { getRelativePath } from "./file";

export const extractLeadingWords = (value: string) =>
	value
		.trim()
		.match(/^[\w\s]+/)
		?.at(0)
		?.trim() ?? "";

export const removeNonWordChars = (value: string) =>
	value.replaceAll(/\W/g, " ");

export const looksLikeTVShow = (sourceFile: SourceFile) => {
	// Does the path have E123 or S123
	// then we guess it might be a tv show
	return /[SE]\d+/.test(getRelativePath(sourceFile));
};

const extractMetaNumber = (metaChar: string, sourceFile: SourceFile) => {
	const result = getRelativePath(sourceFile).match(
		new RegExp(`/${metaChar}(\\d+)/`),
	);
	if (!result) return;
	const [, value] = result;
	if (value) {
		return Number.parseInt(value);
	}
};

export const parseSeasonNumber = (sourceFile: SourceFile) =>
	extractMetaNumber("S", sourceFile);

export const parseEpisodeNumber = (sourceFile: SourceFile) =>
	extractMetaNumber("E", sourceFile);
