import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useSession, signOut } from 'next-auth/client';
import { Menu } from '@headlessui/react';

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
        <button className="px-4 font-light text-2xl bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text" onClick={() => router.push('/')}>social</button>

        <div className="flex items-center space-x-4">
          <input
            className="w-64 px-4 py-2 bg-gray-100 border-0 border-b border-gray-200 focus:border-black focus:ring-0"
            type="text"
            placeholder="Search..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handle}
          />

          <div className="w-10 h-10 relative">
            <Menu>
              <Menu.Button className="focus:outline-none">
                <img className="w-10 h-10" src={session && session.user.image} />
              </Menu.Button>
              <Menu.Items className="absolute flex flex-col right-0 w-56 mt-1 origin-top-right font-light text-sm text-gray-600 bg-white border shadow-lg outline-none">
                <Menu.Item>
                  {() => (
                    <button className={`flex text-left p-4 hover:text-black hover:bg-gray-50`} onClick={() => router.push('/account')}>Account</button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {() => (
                    <button className={`flex text-left p-4 hover:text-black hover:bg-gray-50`} onClick={() => signOut()}>Sign Out</button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </nav>
    </div>
  );
}
