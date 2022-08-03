const BASE_PADDING = 2;

function convert(yamlText) {
  const yamlTextLines = yamlText.split('\n')

  const converter = new Converter()

  for (let [key, value] of parse(yamlTextLines)) {

    if (key[indentOf(key)] === '-') {
      converter.addListElement(key)
      continue;
    }
    converter.flushBracketsFor(key)
    converter.addKey(key)
    if (!!value) {
      converter.addValue(value)
    } else {
      converter.openBracketFor()
    }
    converter.prevRowIndent = indentOf(key)
  }

  converter.flushRemainedBrackets()
  converter.result += "}"
  return converter.result
}

class Converter {
  result = "{"
  prevRowIndent = 0
  closeBracketStack = []
  listFlag = false

  constructor() { }

  addListElement(key) {
    if (this.listFlag === false) {
      this.result = this.result.slice(0, this.result.length - 1)
      this.result += `[`
      this.listFlag = true
      this.closeBracketStack.pop()
      this.closeBracketStack.push(`]`)
    }
    const listElement = key.split('-')[1]
    this.result += `${this.separator(key)}${jsonText(listElement)}`
    this.prevRowIndent = indentOf(key)
  }

  flushBracketsFor(key) {
    if (indentOf(key) < this.prevRowIndent) {
      for (let i = 0; i < (this.prevRowIndent - indentOf(key)) / 2; i++) {
        this.result += this.closeBracketStack.pop()
      }
    }
  }

  addKey(key) {
    this.result += `${this.separator(key)}"${jsonText(key)}": `
  }

  addValue(value) {
    this.result += `${jsonText(value)}`
  }

  openBracketFor() {
    this.result += `{`
    this.closeBracketStack.push(`}`)
  }

  flushRemainedBrackets() {
    this.closeBracketStack.reverse().forEach(bracket => this.result += bracket)
  }

  separator(key) {
    if (indentOf(key) <= this.prevRowIndent && this.prevRowIndent !== 0) {
      return ','
    } else {
      return ''
    }
  }
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

module.exports = convert
