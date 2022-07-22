function statement(invoice, plays) {

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  function getTotalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += getThisAmountByType(playFor(perf).type, perf);
    }
    return result;
  }

  function volumeCredits() {
    let result = 0
    for (let perf of invoice.performances) {
      result += getVolumeCredits(playFor(perf), perf)
    }
    return result
  }

  function getResultOf(invoice) {
    let result = `Invoice (Customer: ${invoice.customer})\n`;
    for (let perf of invoice.performances) {
      result += ` ${playFor(perf).name}: ${usd(getThisAmountByType(playFor(perf).type, perf))} (${perf.audience} seats)\n`;
    }
    return result;
  }

  let result = getResultOf(invoice) 
  result += `totalAmount: ${usd(getTotalAmount())}\n`;
  result += `points: ${volumeCredits()} points\n`;
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

module.exports = statement
