function convert(yamlString) {
  let result = "{\n"

  result += `  "application": {\n`
  result += `    "host": "www.example.com",\n`,
  result += `    "port": 443\n`,
  result += `  }\n`,
  result += "}\n"
  return result
}

module.exports = convert
