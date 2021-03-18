import { useEffect, useState } from 'react';

export default function Stock ({ ticker }) {
  const [price, setPrice] = useState('...');

  useEffect(() => {
    async function fetchPrice () {
      const res = await fetch('api/v1/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker })
      });

      const { price } = await res.json();

      setPrice('$' + price.toFixed(2));
    }

    fetchPrice();
  }, []);

  return <div className="flex justify-between items-center font-mono text-sm">
    <div>${ticker.toUpperCase()}</div>
    <div>{price}</div>
  </div>;
}
