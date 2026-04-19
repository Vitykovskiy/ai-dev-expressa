export default {
  "*.{js,mjs,cjs,ts,tsx,vue,css,scss,md,json,yml,yaml}": ["prettier --write"],
  "backend/**/*.{ts,js}": ["eslint --fix --config backend/eslint.config.mjs"],
  "frontend/**/*.{ts,js,vue}": [
    "eslint --fix --config frontend/eslint.config.mjs",
  ],
  "frontend/**/*.{css,scss,vue}": [
    "stylelint --fix --config frontend/stylelint.config.mjs",
  ],
};
