const {statement, statementInHtml}= require('./statement')

const invoices = require('./invoices.json')
const plays = require('./plays.json')

test('statement should print correct result', () => {
  expect(statement(invoices[0], plays)).toBe(`Invoice (Customer: BigCo)\n Hamlet: $650.00 (55 seats)\n As You Like It: $580.00 (35 seats)\n Othello: $500.00 (40 seats)\ntotalAmount: $1,730.00\npoints: 47 points\n`);
});

test('statementInHtml should print correct result', () => {
  expect(statementInHtml(invoices[0], plays)).toBe(`<ul><li>Invoice (Customer: BigCo)</li><li>Hamlet: $650.00 (55 seats)</li><li>As You Like It: $580.00 (35 seats)</li><li>Othello: $500.00 (40 seats)</li><li>totalAmount: $1,730.00</li><li>points: 47 points</li></ul>`);
});
