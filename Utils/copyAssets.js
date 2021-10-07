const fse = require("fs-extra");
const path = require("path");

const srcPath = path.resolve("./Client/public");
const destPath = path.resolve("./dist/client");
const distPath = path.resolve("./dist");
const packagePath = path.resolve("./package.json");
const packageLockPath = path.resolve("./package-lock.json");

fse.copySync(srcPath, destPath);
fse.copySync(packageLockPath, path.resolve(distPath, "package-lock.json"));
fse.copySync(packagePath, path.resolve(distPath, "package.json"));