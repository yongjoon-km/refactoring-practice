const fs = require('fs');
const convert = require('./convert');
const yamlText = fs.readFileSync(`${__dirname}/test1.yaml`, 'utf-8');

test('it should read yaml', () => {
  expect(convert(yamlText)).toBe(
`{
  "application": {
    "host": "www.example.com",
    "port": 443
  }
}
`)
});
