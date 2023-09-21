//There seems to be a bug while generating types
//using openapi-client-axios-codegen where
//it cant find certain linked components,
//this script expands types manually to fix it

function expandParameters(data) {
  Object.values(data.paths).map((path) => {
    const operation = path?.post || path?.get;

    if (!operation.parameters) return path;

    operation.parameters = operation.parameters.map((p) => {
      const [type, name] = p["$ref"].split("/").slice(-2);
      let parameter = data.components[type][name];

      if (type === "headers") {
        parameter.name = name;
        parameter.in = "header";
      }

      if (type === "securitySchemes") {
        delete parameter.type;
        parameter.schema = {
          type: "string",
        };
      }

      return parameter;
    });
  });
}

module.exports = expandParameters;
