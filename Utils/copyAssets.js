const fse = require("fs-extra");
const path = require("path");

const srcPath = path.resolve("./Client/public");
const destPath = path.resolve("./dist/client");

fse.copySync(srcPath, destPath);