const fs = require("fs-extra");
const { publish } = require("libnpmpublish");
const readline = require("readline");

(async () => {
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

  try {
    await fs.writeFile("package.json", JSON.stringify(publishPkgJson, null, 2), { encoding: "utf8" });
    const res = await publish(__dirname, publishPkgJson, {
      access: `public`,
      token
    });
    console.log(res);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await fs.writeFile("package.json", pkgJsonString, { encoding: "utf8" });
  }
})();
