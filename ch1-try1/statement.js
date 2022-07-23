function statement(invoice, plays) {

  return renderToText(generateReport(invoice, plays))
}

function statementInHtml(invoice, plays) {

  return renderToHtml(generateReport(invoice, plays))
}

function generateReport(invoice, plays) {
  function getTotalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += getThisAmountByType(playFor(perf).type, perf);
    }
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  function volumeCredits() {
    let result = 0
    for (let perf of invoice.performances) {
      result += getVolumeCredits(playFor(perf), perf)
    }
    return result
  }

  function performancesResult() {

    const performancesResult = []
    for (let perf of invoice.performances) {
      performancesResult.push({ label: playFor(perf).name, amount: usd(getThisAmountByType(playFor(perf).type, perf)), seats: perf.audience })
    }

    return performancesResult;
  }
  return {
    customer: invoice.customer,
    totalAmount: usd(getTotalAmount()),
    volumeCredits: volumeCredits(),
    performanceReports: performancesResult()
  }
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

function getVolumeCredits(play, perf) {

  let result = 0;

  result += Math.max(perf.audience - 30, 0);
  if ("comedy" === play.type) result += Math.floor(perf.audience / 5);

  return result;
}

function usd(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
    .format(amount / 100);
}

function getThisAmountByType(playType, perf) {
  let result = 0;
  switch (playType) {
    case "tragedy":
      result = 40000;
      if (perf.audience > 30) {
        result += 1000 * (perf.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (perf.audience > 20) {
        result += 10000 + 500 * (perf.audience - 20);
      }
      result += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown genre: ${play.type}`);
  }
  return result;
}

module.exports = {statement, statementInHtml}
