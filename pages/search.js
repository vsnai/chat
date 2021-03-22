import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import useSWR from 'swr';

import Layout from '../components/layout';

export default function Search () {
  const router = useRouter();

  const [session, loading] = useSession();

  const { q } = router.query;

  const { data, error, mutate } = useSWR(
    ! loading && `/api/v1/search/${q}`,
    (...args) => fetch(...args).then(res => res.json())
  );

  useEffect(() => {
    if (error) {
      router.push('/api/auth/signin');
    }
  }, [error]);

  async function follow (user) {
    mutate(data => ({
      ...data,
      results: data.results.map(u => {
        if (u._id === user._id) {
          const isFollowing = ! u.isFollowing;

          return { ...u, isFollowing };
        } else {
          return u;
        }
      })
    }), false);

    await fetch('/api/v1/follows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });

    mutate();
  }

  async function unfollow (user) {
    mutate(data => ({
      ...data,
      results: data.results.map(u => {
        if (u._id === user._id) {
          const isFollowing = ! u.isFollowing;

          return { ...u, isFollowing };
        } else {
          return u;
        }
      })
    }), false);

    await fetch('/api/v1/follows', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });

    mutate();
  }

  return (
    <Layout>
      {data &&
        <div className="container flex mt-4 space-x-4">
          <aside className="flex-none flex flex-col w-64">
            {/*  */}
          </aside>

          <div className="flex-auto">
            <div className="flex flex-col items-center bg-white p-2 border-b">
              {data.results.length > 0
                ? data.results.map(user => {
                  return <div key={user._id} className="flex items-center w-full hover:bg-gray-100">
                    <button className="flex flex-auto items-center space-x-4 p-2" onClick={() => router.push(`/${user.name}`)}>
                      <img className="w-16 h-16 rounded-full" src={user.image} />
                      <div>{user.name}</div>
                    </button>

                    {session.user._id !== user._id &&
                      <button
                        onClick={user.isFollowing ? () => unfollow(user) : () => follow(user)}
                        className='flex-none mx-2 px-4 py-2 text-white border bg-black border-black hover:bg-white hover:text-black'
                      >
                        {user.isFollowing ? 'Unfollow' : 'Follow'}
                      </button>
                    }
                  </div>
                })
                : <div>No users found!</div>
              }
            </div>
          </div>

          <aside className="flex-none flex flex-col w-64">
            {/*  */}
          </aside>
      </div>
      }
    </Layout>
  );
}
