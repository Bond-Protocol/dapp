const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const expandParameters = require("./parse-openapi-parameters");

const data = fs.readFileSync(path.join(__dirname, "..", "openapi.yml"), "utf8");

//Convert Yml object to JSON
const yamlData = yaml.load(data);
//expandParameters(yamlData);

//Write JSON to Yml
const jsonData = JSON.stringify(yamlData);
const file = path.join(__dirname, "..", "src", "openapi.json");

fs.writeFileSync(file, jsonData, "utf8");
