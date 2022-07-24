const generateReport = require('./generateReport')

function statement(invoice, plays) {

  return renderToText(generateReport(invoice, plays))
}

function statementInHtml(invoice, plays) {

  return renderToHtml(generateReport(invoice, plays))
}

function renderToText(report) {

  let result = `Invoice (Customer: ${report.customer})\n`;
  for (let { label, amount, seats } of report.performanceReports) {
    result += ` ${label}: ${amount} (${seats} seats)\n`;
  }
  result += `totalAmount: ${report.totalAmount}\n`;
  result += `points: ${report.volumeCredits} points\n`;
  return result;
}

function renderToHtml(report) {

  let result = `<ul>`
  result += `<li>Invoice (Customer: ${report.customer})</li>`;
  for (let { label, amount, seats } of report.performanceReports) {
    result += `<li>${label}: ${amount} (${seats} seats)</li>`;
  }
  result += `<li>totalAmount: ${report.totalAmount}</li>`;
  result += `<li>points: ${report.volumeCredits} points</li>`;
  result += `</ul>`
  return result;
}

module.exports = {statement, statementInHtml}
