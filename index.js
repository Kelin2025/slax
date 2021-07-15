#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv)).argv;

const slaxConfigPath = path.resolve("./slax.config.json");

const commands = {
  mkdir: (options) => {
    if (Array.isArray(options.path)) {
      for (const p of options.path) {
        commands.mkdir({ ...options, path: p });
      }
    } else {
      const p = path.resolve(options.path);
      fs.ensureDir(p);
    }
  },
  writeFile: (options) => {
    const p = path.resolve(options.path);
    fs.ensureFileSync(p);
    fs.writeFileSync(p, options.content.join("\n"));
  },
  appendFile: (options) => {
    const p = path.resolve(options.path);
    fs.ensureFileSync(p);
    fs.appendFileSync(p, options.content.join("\n"));
  },
};

const variableRegexp = /\%([a-zA-Z0-9_]+)\%/g;
const evaluateString = (str, variables) => {
  return str.replace(variableRegexp, (_, name) => {
    if (!(name in variables)) {
      console.error(`[slax] Missing variable ${name} in options`);
      process.exit();
    }
    return variables[name];
  });
};

const deepInjectVariables = (data, variables) => {
  if (typeof data === "object") {
    if (data === null) {
      return null;
    } else if (Array.isArray(data)) {
      return data.map((item) => deepInjectVariables(item, variables));
    } else {
      const res = { ...data };
      for (const k in res) {
        res[k] = deepInjectVariables(res[k], variables);
      }
      return res;
    }
  } else if (typeof data === "string") {
    return evaluateString(data, variables);
  }
};

switch (argv._[0]) {
  case "m":
  case "make": {
    let config;
    try {
      config = JSON.parse(fs.readFileSync(path.resolve("slax.config.json")));
    } catch (err) {
      console.error(`[slax] Failed to parse slax.config.json`);
      process.exit();
    }

    if (!argv._[1]) {
      console.error(`[slax] No template specified`);
      process.exit();
    }
    const template = config.templates[argv._[1]];
    if (!template) {
      console.error(`[slax] No template ${argv._[1]} found`);
      process.exit();
    }
    for (const command of template.commands) {
      const parsedOptions = deepInjectVariables(command.options, argv);
      commands[command.type](parsedOptions);
    }
    break;
  }
  case "init": {
    fs.ensureFileSync(slaxConfigPath);
    fs.writeFileSync(slaxConfigPath, ["{", '\t"commands": {}', "}"].join("\n"));
    break;
  }
  default: {
    console.error(`[slax] Unknown command ${argv._}`);
  }
}
