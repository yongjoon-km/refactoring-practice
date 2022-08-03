function convert(yamlText) {
  const yamlTextLines = yamlText.split('\n')

  const BASE_PADDING = 2;
  const converter = new Converter()

  for (let [key, value] of parse(yamlTextLines)) {

    if (key[indentOf(key)] === '-') {
      if (converter.listFlag === false) {
        converter.result = converter.result.slice(0, converter.result.length - 1)
        converter.result += `[`
        converter.listFlag = true
        converter.closeBracketStack.pop()
        converter.closeBracketStack.push(`\n${padding(indentOf(key))}]`)
      }
      listElement = key.split('-')[1]
      converter.result += `${separator(key)}${padding(indentOf(key) + BASE_PADDING)}${jsonText(listElement)}`
      converter.prevRowIndent = indentOf(key)
      continue;
    }

    if (indentOf(key) < converter.prevRowIndent) {
      for (let i = 0; i < (converter.prevRowIndent - indentOf(key)) / 2; i++) {
        converter.result += converter.closeBracketStack.pop()
      }
    }

    converter.result += `${separator(key)}${padding(indentOf(key) + BASE_PADDING)}"${jsonText(key)}": `
    if (!!value) {
      converter.result += `${jsonText(value)}`
    } else {
      converter.result += `{`
      converter.closeBracketStack.push(`\n${padding(indentOf(key) + BASE_PADDING)}}`)
    }
    converter.prevRowIndent = indentOf(key)
  }

  converter.closeBracketStack.reverse().forEach(bracket => converter.result += bracket)
  converter.result += "\n}\n"
  return converter.result

  function separator(key) {
    if (indentOf(key) <= converter.prevRowIndent && converter.prevRowIndent !== 0) {
      return ',\n'
    } else {
      return '\n'
    }
  }
}

class Converter {
  result = "{"
  prevRowIndent = 0
  closeBracketStack = []
  listFlag = false

  constructor() { }
}

function parse(yamlTextLines) {
  let result = []
  for (let textLine of yamlTextLines) {
    if (!textLine) {
      break;
    }
    result.push(textLine.split(':'))
  }
  return result
}

function jsonText(text) {
  let result = text.trim()
  if (result[0] === "'") {
    result = text.split("'")[1]
    result = `"${result}"`
  }
  return result;
}

function indentOf(text) {
  let result = ""
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " ") {
      result++;
    } else {
      break;
    }
  }
  return result
}

function padding(paddingCount) {
  let result = ""
  for (let i = 0; i < paddingCount; i++) {
    result += " "
  }
  return result;
}

module.exports = convert
