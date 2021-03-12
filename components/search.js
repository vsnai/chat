import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Search ({ query }) {
  const router = useRouter();

  const [input, setInput] = useState(query);

  function handle (e) {
    if (e.key === 'Enter') {
      router.push({
        pathname: '/search',
        query: { q: input },
      });
    }
  }

  return (
    <input
      className="px-4 py-2 border mr-4"
      type="text"
      placeholder="Search"
      value={input}
      onChange={e => setInput(e.target.value)}
      onKeyDown={handle}
    />
  );
}
