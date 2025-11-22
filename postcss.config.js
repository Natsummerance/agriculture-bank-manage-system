import { createRequire } from "module";

const require = createRequire(import.meta.url);
const tailwindcss = require("@tailwindcss/postcss");
const autoprefixer = require("autoprefixer");

export default {
  plugins: [tailwindcss(), autoprefixer()],
};
