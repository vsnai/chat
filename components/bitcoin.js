import { useEffect, useState } from 'react';

export default function Bitcoin ({ currency }) {
  const [price, setPrice] = useState('...');

  const symbol = {
    USD: '$',
    EUR: '€',
  }

  useEffect(() => {
    async function fetchPrice () {
      const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
      const { bpi } = await res.json();

      setPrice(symbol[currency] + bpi[currency]['rate_float'].toFixed(2));
    }

    fetchPrice();
  }, []);

  return <div className="bg-white p-4">{price}</div>;
}
