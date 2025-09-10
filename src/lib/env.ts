export const getSourcePath = () => {
	const sourcePath = process.env.SOURCE_PATH;
	if (!sourcePath) throw new Error("SOURCE_PATH env var missing");
	return sourcePath;
};
