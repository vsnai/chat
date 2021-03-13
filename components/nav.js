import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/client';

export default function Nav ({ user, query }) {
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
    <nav className="flex flex-grow justify-between items-center">
      <button className="px-4 py-2" onClick={() => router.push('/')}>Home</button>

      <div>
        <input
          className="px-4 py-2 border mr-4"
          type="text"
          placeholder="Search"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handle}
        />

        <button className="px-4 py-2" onClick={() => router.push(`/${user.name}`)}>Profile</button>
        <button className="px-4 py-2" onClick={() => router.push('/account')}>Settings</button>
        <button onClick={() => signOut()}>Sign out ({user.name})</button>
      </div>
    </nav>
  );
}
