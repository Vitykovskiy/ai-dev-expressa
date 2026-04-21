import path from "node:path";

const textExtensions = new Set([
  ".cjs",
  ".css",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".scss",
  ".ts",
  ".tsx",
  ".vue",
  ".yaml",
  ".yml",
]);

const quote = (value) => JSON.stringify(value);

const toPosix = (value) => value.split(path.sep).join("/");

const relativeToRoot = (filePath) =>
  toPosix(path.relative(process.cwd(), filePath));

const command = (prefix, bin, args, files) =>
  `npm --prefix ${prefix} exec ${bin} -- ${args} ${files.map(quote).join(" ")}`;

const contourFiles = (prefix, files) =>
  files.map(relativeToRoot).filter((file) => file.startsWith(`${prefix}/`));

const repositoryTextFiles = (files) =>
  files
    .filter((file) => {
      const relativePath = relativeToRoot(file);
      return (
        !relativePath.startsWith("backend/") &&
        !relativePath.startsWith("frontend/") &&
        textExtensions.has(path.extname(relativePath))
      );
    })
    .map(relativeToRoot);

const prettier = (prefix, files) =>
  command(prefix, "prettier", "--ignore-path .prettierignore --write", files);

const eslint = (prefix, files) =>
  command(
    prefix,
    "eslint",
    `--fix --config ${prefix}/eslint.config.mjs`,
    files,
  );

const stylelint = (files) =>
  command(
    "frontend",
    "stylelint",
    "--fix --config frontend/stylelint.config.mjs",
    files,
  );

export default {
  "*": (files) => {
    const matchedFiles = repositoryTextFiles(files);
    return matchedFiles.length > 0 ? [prettier("backend", matchedFiles)] : [];
  },
  "backend/**/*.{js,mjs,cjs,ts,tsx,vue,css,scss,md,json,yml,yaml}": (files) => {
    const matchedFiles = contourFiles("backend", files);
    return matchedFiles.length > 0 ? [prettier("backend", matchedFiles)] : [];
  },
  "backend/**/*.{ts,js}": (files) => {
    const matchedFiles = contourFiles("backend", files);
    return matchedFiles.length > 0 ? [eslint("backend", matchedFiles)] : [];
  },
  "frontend/**/*.{js,mjs,cjs,ts,tsx,vue,css,scss,md,json,yml,yaml}": (
    files,
  ) => {
    const matchedFiles = contourFiles("frontend", files);
    return matchedFiles.length > 0 ? [prettier("frontend", matchedFiles)] : [];
  },
  "frontend/**/*.{ts,js,vue}": (files) => {
    const matchedFiles = contourFiles("frontend", files);
    return matchedFiles.length > 0 ? [eslint("frontend", matchedFiles)] : [];
  },
  "frontend/**/*.{css,scss,vue}": (files) => {
    const matchedFiles = contourFiles("frontend", files);
    return matchedFiles.length > 0 ? [stylelint(matchedFiles)] : [];
  },
};
