import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';

import Layout from '../components/layout';

export default function Account () {
  const router = useRouter();

  const { data, error, mutate } = useSWR('/api/v1/users', (...args) => fetch(...args).then(res => res.json()));

  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (error) {
      router.push('/api/auth/signin');
    }
  }, [error]);

  async function save () {
    if (data.user.name === '') {
      return;
    }

    setIsLoading(true);
    setIsError(false);

    const res = await fetch('/api/v1/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.user.name })
    });

    if (res.status === 400) {
      setIsError(true);
    }

    mutate();
    setIsChanged(false);
    setIsLoading(false);
  }

  return (
    <Layout>
      {data && <>
        <div className="container flex mt-4 space-x-4">
          <aside className="flex-none flex flex-col w-64">
            {/*  */}
          </aside>

          <div className="flex-auto flex flex-col space-y-4">
            <div className="flex">
              <input
                className="flex-auto px-4 py-2 border-0 border-b mr-4 border-gray-200 focus:border-black focus:ring-0"
                type="text"
                value={data.user.name}
                onChange={e => {
                  setIsChanged(true);
                  mutate({
                    user: {
                      ...data.user,
                      name: e.target.value.replace(/[^a-z]/gi, '').toLowerCase()
                    }
                  }, false)
                }}
              />

              <button
                onClick={() => save()}
                className={`flex-none w-32 px-4 py-2 text-white border ${isLoading || ! isChanged || data.user.name === '' ? 'text-gray-300 bg-gray-100 border-gray-300 point cursor-default' : 'bg-black border-black hover:bg-white hover:text-black'}`}
                disabled={isLoading || ! isChanged || data.user.name === ''}
              >
                Save
              </button>
            </div>

            {isError && <div className="px-4 py-2 right-4 bottom-4 text-white bg-gradient-to-r from-red-700 to-red-600">Name already taken...</div>}
          </div>

          <aside className="flex-none flex flex-col w-64">
            {/*  */}
          </aside>
        </div>
      </>}
    </Layout>
  )
}
