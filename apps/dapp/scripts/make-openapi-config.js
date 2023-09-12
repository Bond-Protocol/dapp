//Load the package
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

//Read the Yaml file
const data = fs.readFileSync(path.join(__dirname, "..", "openapi.yml"), "utf8");

//Convert Yml object to JSON
const yamlData = yaml.load(data);

//Write JSON to Yml
const jsonData = JSON.stringify(yamlData);
fs.writeFileSync(
  path.join(__dirname, "..", "src", "openapi.json"),
  jsonData,
  "utf8"
);
