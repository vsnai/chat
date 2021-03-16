import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/client';

export default function Nav () {
  const router = useRouter();

  const [session, loading] = useSession();
  const [input, setInput] = useState('');

  useEffect(() => {
    if (router.query.q) {
      setInput(router.query.q);
    }
  }, [router]);

  function handle (e) {
    if (e.key === 'Enter') {
      router.push({
        pathname: '/search',
        query: { q: input },
      });
    }
  }

  return (
    <div className="flex-none border-b py-4">
      <nav className="flex flex-grow container mx-auto justify-between items-center">
        <button className="px-4 py-2" onClick={() => router.push('/')}>Home</button>

        <div className="flex items-center">
          <input
            className="w-64 px-4 py-2 mr-4 bg-gray-100 border-0 border-b border-gray-200 focus:border-black focus:ring-0"
            type="text"
            placeholder="Search"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handle}
          />

          <button className="px-4 py-2" onClick={() => router.push(`/${session.user.name}`)}>Profile</button>
          <button className="px-4 py-2" onClick={() => router.push('/account')}>Account</button>
          <button className="px-4 py-2" onClick={() => signOut()}>Sign out ({session && session.user.name})</button>
          <button className="" onClick={() => {}}>
            <img className="w-10 h-10 rounded-full" src={session && session.user.image} />
          </button>
        </div>
      </nav>
    </div>
  );
}
