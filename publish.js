const fs = require("fs-extra");
const { publish } = require("libnpmpublish");
const readline = require("readline");
const { prerelease } = require("semver");

const args = process.argv.slice(2);

(async ([dryRun]) => {
  const pkgJsonString = await fs.readFile("package.json", "utf8");
  const pkgJson = JSON.parse(pkgJsonString);
  const publishPkgJson = { ...pkgJson };
  delete publishPkgJson.scripts;
  delete publishPkgJson.devDependencies;

  const rl = readline.createInterface(process.stdin, process.stdout);

  function ask(query) {
    return new Promise(resolve => {
      rl.question(query, input => {
        resolve(input);
      });
    });
  }

  const token = await ask(`token: `);
  rl.close();

  const defaultTag = prerelease(pkgJson.version) ? "next" : "latest";

  try {
    await fs.writeFile(
      "package.json",
      JSON.stringify(publishPkgJson, null, 2),
      { encoding: "utf8" }
    );
    if (!dryRun) {
      const res = await publish(__dirname, publishPkgJson, {
        access: `public`,
        defaultTag,
        token
      });
      console.log(res);
    } else {
      console.log("== package.json ==");
      console.log(JSON.stringify(publishPkgJson, null, 2));
      console.log();
      console.log("== options ==");
      console.log({
        access: `public`,
        defaultTag,
        token
      });
    }
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await fs.writeFile("package.json", pkgJsonString, { encoding: "utf8" });
  }
})([args.includes("--dry-run")]);
