function convert(yamlText) {
  const yamlTextLines = yamlText.split('\n')

  let result = "{"
  let prevRowIndent = 0;
  let closeBracketStack = []
  const BASE_PADDING = 2;
  let listFlag = false;
  for (let textLine of yamlTextLines) {
    if (!textLine) {
      break;
    }

    const [key, value] = textLine.split(':')

    if (key[indentOf(key)] === '-') {
      if (listFlag === false) {
        result = result.slice(0, result.length - 1)
        result += `[`
        listFlag = true
        closeBracketStack.pop()
        closeBracketStack.push(`\n${padding(indentOf(key))}]`)
      }
      listElement = key.split('-')[1]
      result += `${separator(key)}${padding(indentOf(key) + BASE_PADDING)}${jsonText(listElement)}`
      prevRowIndent = indentOf(key)
      continue;
    }

    if (indentOf(key) < prevRowIndent) {
      for (let i = 0; i < (prevRowIndent - indentOf(key)) / 2; i++) {
        result += closeBracketStack.pop()
      }
    }

    result += `${separator(key)}${padding(indentOf(key) + BASE_PADDING)}"${jsonText(key)}": `
    if (!!value) {
      result += `${jsonText(value)}`
    } else {
      result += `{`
      closeBracketStack.push(`\n${padding(indentOf(key) + BASE_PADDING)}}`)
    }
    prevRowIndent = indentOf(key)
  }

  closeBracketStack.reverse().forEach(bracket => result += bracket)
  result += "\n}\n"
  return result

  function separator(key) {
    if (indentOf(key) <= prevRowIndent && prevRowIndent !== 0) {
      return ',\n'
    } else {
      return '\n'
    }
  }
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
