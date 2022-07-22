const statement = require('./statement')

const invoices = require('./invoices.json')
const plays = require('./plays.json')

test('statement should print correct result', () => {
  expect(statement(invoices[0], plays)).toBe(`Invoice (Customer: BigCo)\n Hamlet: $650.00 (55 seats)\n As You Like It: $580.00 (35 seats)\n Othello: $500.00 (40 seats)\ntotalAmount: $1,730.00\npoints: 47 points\n`);
});
