import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useSession } from 'next-auth/client';

import Layout from '../components/layout';
import Tweet from '../components/tweet';

import { RespondentContext } from '../contexts/RespondentContext';

export default function Profile () {
  const router = useRouter();

  const { name } = router.query;

  const [session, loading] = useSession();

  const { data, error, mutate } = useSWR(
    ! loading && `/api/v1/profile/${name}`,
    (...args) => fetch(...args).then(res => res.json())
  );

  const { setRespondent } = useContext(RespondentContext);

  useEffect(() => {
    if (error) {
      router.push('/api/auth/signin');
    }
  }, [error]);

  async function follow () {
    mutate(data => ({
      ...data,
      user: { ...data.user, isFollowing: true },
      followingCount: data.followingCount + 1
    }), false);

    await fetch('/api/v1/follows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: data.user })
    });

    mutate();
  }

  async function unfollow () {
    mutate(data => ({
      ...data,
      user: { ...data.user, isFollowing: false },
      followingCount: data.followingCount - 1
    }), false);

    await fetch('/api/v1/follows', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: data.user })
    });

    mutate();
  }

  return (
    <Layout>
      {data &&
        <div className="container flex mt-4 space-x-4">
          <div className="flex-none flex flex-col w-64">
          </div>

          <div className="flex-auto">
            <div className="flex justify-between items-center bg-white p-8 border-b">
              <div className="flex items-center space-x-4">
                <img className="w-36 h-36" src={data.user.image} />
                <div className="flex flex-col flex-auto space-y-4">
                  <div className="text-xl tracking-widest">{data.user.name}</div>
                  <div className="flex flex-col">
                    <div>Following: <span className="font-bold">{data.followersCount}</span></div>
                    <div>Followers: <span className="font-bold">{data.followingCount}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                {session.user._id !== data.user._id &&
                  <button
                    onClick={data.user.isFollowing ? () => unfollow() : () => follow()}
                    className='flex-none mx-2 px-4 py-2 text-white border bg-black border-black hover:bg-white hover:text-black'
                  >
                    {data.user.isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                }

                <div>
                  <button
                    onClick={() => setRespondent(data.user)}
                    className='flex mx-2 px-4 py-2 text-white border bg-black border-black hover:bg-white hover:text-black'
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full items-center mb-8">
              {data.tweets.map(tweet => <Tweet key={tweet._id} session={session} tweet={tweet} mutate={mutate} />)}
            </div>
          </div>

          <div className="flex-none flex flex-col w-64">
          </div>
        </div>
      }
    </Layout>
  );
}
