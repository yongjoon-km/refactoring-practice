const fs = require('fs');
const convert = require('./convert');
const yamlText = fs.readFileSync(`${__dirname}/test1.yaml`, 'utf-8');

test('it should convert yaml to json correctly', () => {
  expect(convert(yamlText)).toBe(
`{
  "application": {
    "host": "www.example.com",
    "port": 443
  }
}
`)
});

test('it should convert 2 depth yaml to json', () => {
  const test2Text = fs.readFileSync(`${__dirname}/test2.yaml`, 'utf-8');
  expect(convert(test2Text)).toBe(
`{
  "application": {
    "host": "www.example.com",
    "port": 443,
    "description": {
      "name": "bucket server"
    }
  }
}
`)
})

test('it should convert 1-2-1 depth yaml to json', () => {
  const test3Text = fs.readFileSync(`${__dirname}/test3.yaml`, 'utf-8');
  expect(convert(test3Text)).toBe(
`{
  "application": {
    "host": "www.example.com",
    "port": 443,
    "description": {
      "name": "bucket server"
    },
    "ttl": 60
  }
}
`)
})
