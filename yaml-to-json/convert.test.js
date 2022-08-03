const fs = require('fs');
const convert = require('./convert');
const yamlText = fs.readFileSync(`${__dirname}/test1.yaml`, 'utf-8');

test('it should convert yaml to json correctly', () => {
  expect(JSON.stringify(JSON.parse(convert(yamlText)))).toBe(
    JSON.stringify({
      "application": {
        "host": "www.example.com",
        "port": 443
      }
    }
    ))
});

test('it should convert 2 depth yaml to json', () => {
  const yamlText = fs.readFileSync(`${__dirname}/test2.yaml`, 'utf-8');
  expect(JSON.stringify(JSON.parse(convert(yamlText)))).toBe(
    JSON.stringify({
      "application": {
        "host": "www.example.com",
        "port": 443,
        "description": {
          "name": "bucket server"
        }
      }
    })
  )
})

test('it should convert 1-2-1 depth yaml to json', () => {
  const yamlText = fs.readFileSync(`${__dirname}/test3.yaml`, 'utf-8');
  expect(JSON.stringify(JSON.parse(convert(yamlText)))).toBe(
    JSON.stringify({
      "application": {
        "host": "www.example.com",
        "port": 443,
        "description": {
          "name": "bucket server"
        },
        "ttl": 60
      }
    }))
})

test('it should convert nested depth yaml to json', () => {
  const yamlText = fs.readFileSync(`${__dirname}/test4.yaml`, 'utf-8');
  expect(JSON.stringify(JSON.parse(convert(yamlText)))).toBe(
    JSON.stringify({
      "application": {
        "host": "www.example.com",
        "port": 443,
        "description": {
          "name": {
            "origin": "bob",
            "ttl": 123
          }
        },
        "ttl": 60
      }
    }
    ))
})

test('it should process to list in yaml', () => {
  const yamlText = fs.readFileSync(`${__dirname}/test5.yaml`, 'utf-8');
  expect(JSON.stringify(JSON.parse(convert(yamlText)))).toBe(
    JSON.stringify({
      "application": {
        "host": "www.example.com",
        "port": [
          443,
          80
        ],
        "name": "bob"
      }
    }
    ))
})

test('transform object list', () => {
  const yamlText = fs.readFileSync(`${__dirname}/test6.yaml`, 'utf-8');
  expect(JSON.stringify(JSON.parse(convert(yamlText)))).toBe(
    JSON.stringify({
      "application": {
        "host": "www.example.com",
        "port": [
          443,
          80
        ],
        "name": "bob",
        "servers": [
          {
            "host": "image.example.com",
            "port": 443
          },
          {
            "host": "video.example.com",
            "port": 80
          }
        ]
      }
    }
    ))
})

