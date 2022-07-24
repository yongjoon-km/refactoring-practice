function generateReport(invoice, plays) {

  return {
    customer: invoice.customer,
    totalAmount: usd(getTotalAmount()),
    volumeCredits: volumeCredits(),
    performanceReports: performancesResult()
  }


  function createCalculator(perf) {
    switch (playFor(perf).type) {
      case "tragedy":
        return new TragedyCalculator(playFor(perf).type, perf);
      case "comedy":
        return new ComedyCalculator(playFor(perf).type, perf);
      default:
        throw "Now known calculator"
    }
  }

  function getTotalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
      const calculator = createCalculator(perf)
      result += calculator.amount;
    }
    return result;
  }

  function playFor(aPerformance) {

    return plays[aPerformance.playID]
  }

  function volumeCredits() {
    let result = 0
    for (let perf of invoice.performances) {
      const calculator = createCalculator(perf)
      result += calculator.volumeCredits
    }
    return result
  }

  function performancesResult() {

    const performancesResult = []
    for (let perf of invoice.performances) {
      const calculator = createCalculator(perf)
      performancesResult.push({ label: playFor(perf).name, amount: usd(calculator.amount), seats: perf.audience })
    }

    return performancesResult;
  }
}

function usd(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
    .format(amount / 100);
}

class PerformanceCalculator {

  constructor(playType, perf) {
    this.playType = playType;
    this.perf = perf
  }

  get amount() {
    throw new Error(`This method is implemented in sub classes`);
  }

  get volumeCredits() {
    return Math.max(this.perf.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {

  get amount() {
    let result = 0;
    result = 40000;
    if (this.perf.audience > 30) {
      result += 1000 * (this.perf.audience - 30);
    }
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits
  }
}

class ComedyCalculator extends PerformanceCalculator {

  get amount() {
    let result = 30000;
    if (this.perf.audience > 20) {
      result += 10000 + 500 * (this.perf.audience - 20);
    }
    result += 300 * this.perf.audience;
    return result;
  }

  get volumeCredits() {
    let result = 0;

    result += super.volumeCredits
    result += Math.floor(this.perf.audience / 5);

    return result;
  }

}

module.exports = generateReport
