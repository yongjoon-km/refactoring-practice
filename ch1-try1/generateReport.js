function generateReport(invoice, plays) {

  const performances = invoice.performances.map(convertPerformance)
  return {
    customer: invoice.customer,
    totalAmount: usd(getTotalAmount()),
    volumeCredits: volumeCredits(),
    performanceReports: performancesResult()
  }

  function convertPerformance(aPerformance) {
    const calculator = createCalculator(aPerformance)
    return {
      totalAmount: calculator.amount,
      volumeCredit: calculator.volumeCredits,
      performanceResult: { label: playFor(aPerformance).name, amount: usd(calculator.amount), seats: aPerformance.audience }
    };
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
    return performances.reduce((total, p) => total + p.totalAmount, 0)
  }

  function playFor(aPerformance) {

    return plays[aPerformance.playID]
  }

  function volumeCredits() {
    return performances.reduce((total, p) => total + p.volumeCredit, 0);
  }

  function performancesResult() {
    return performances.map(p => p.performanceResult);
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
