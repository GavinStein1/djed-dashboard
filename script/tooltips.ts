
const Tooltips = {
    adaCard: "This is the live price - retrieved from CoinGecko.",
    djedCard: "Djed price is the minimum of 1 ÷ ADA price, and reserves ÷ circulating Djed.",
    shenCard: "Shen price is calculated as equity ÷ circulating Shen.",
    liabilities: "Calculated as the Djed price * circulating Djed.",
    equity: "Equity is the remaining ADA in reserves after liabilities are settled: (reserves - liabilities).",
    ratio: "Calculated as reserves ÷ liabilities."
}

export default Tooltips;