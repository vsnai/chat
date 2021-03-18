import { useEffect, useState } from 'react';

export default function Bitcoin ({ currency }) {
  const [price, setPrice] = useState('...');

  const currencyMap = {
    USD: '$',
    EUR: '€',
  }

  useEffect(() => {
    async function fetchPrice () {
      const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
      const { bpi } = await res.json();

      setPrice(currencyMap[currency] + bpi[currency]['rate_float'].toFixed(2));
    }

    fetchPrice();
  }, []);

  return <div className="flex justify-between items-center font-mono text-sm">
    <div>$BTC</div>
    <div>{price}</div>
  </div>;
}
