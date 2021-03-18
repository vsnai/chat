export default async (req, res) => {
  if (req.method === 'POST') {
    const { ticker } = req.body;

    const response = await fetch(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price`);
    const data = await response.json();

    res.status(200).json({ price: data['quoteSummary']['result'][0]['price']['regularMarketPrice']['raw'] });
  }
};