function convert(yamlText) {

  const yamlTextLines = yamlText.split('\n')

  let result = "{"
  let previousIndent = 0;
  const defaultPadding = 2;
  for (let textLine of yamlTextLines) {
    if (!textLine) {
      let previousIndentString = ""
      for (let i = 0; i < previousIndent; i++) {
        previousIndentString += " "
      }
      result += `\n${previousIndentString}}\n`
      break;
    }
    const [key, value] = textLine.split(':')
    let indent = 0;
    for (let i = 0; i < key.length; i++) {
      if (key[i] === " ") {
        indent++;
      } else {
        break;
      }
    }
    let keyText = key.slice(indent)
    let indentString = ""
    for (let i = 0; i < indent + defaultPadding; i++) {
      indentString += " "
    }

    if (!!value) {
      if (indent == previousIndent) {
        result += ',\n'
      } else {
        result += '\n'
      }
      let valueText = value.trim()
      if (valueText[0] === "'") {
        valueText = value.split("'")[1]
        valueText = `"${valueText}"`
      }
      result += `${indentString}"${keyText}": ${valueText}`
    } else {
      result += `\n${indentString}"${key}": {`
    }
    previousIndent = indent
  }
  result += "}\n"
  return result
}

module.exports = convert
