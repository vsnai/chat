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

  if (! data) {
    return (
      <Layout>
        <div className="container flex mt-4 space-x-4">
          <div className="flex-none flex flex-col w-64">
            {/*  */}
          </div>

          <div className="flex-auto">
            {/* Profile */}
            <div className="flex justify-between items-center bg-white p-8 border-b">
              <div className="flex items-center space-x-8">
                <div className="w-36 h-36 bg-gray-200 animate-pulse"></div>
                <div className="flex flex-col flex-auto space-y-4">
                  <div className="animate-pulse w-32 h-8 bg-gray-200"></div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className='animate-pulse flex-none flex justify-center w-32 mx-2 px-4 py-2 text-gray-200 bg-gray-200'>Chat</div>
                <div className='animate-pulse flex-none flex justify-center w-32 mx-2 px-4 py-2 text-gray-200 bg-gray-200'>Follow</div>
              </div>
            </div>

            {/* Selector */}
            <div className="flex w-full items-center mt-4 text-gray-200 bg-gray-50">
              <div className="flex-1 flex justify-center items-center p-4 space-x-2 bg-white">
                <span className="animate-pulse bg-gray-200">000</span>
                <span>Tweets</span>
              </div>

              <div className="flex-1 flex justify-center items-center p-4 space-x-2">
                <span className="animate-pulse bg-gray-200">000</span>
                <span>Following</span>
              </div>

              <div className="flex-1 flex justify-center items-center p-4 space-x-2">
                <span className="animate-pulse bg-gray-200">000</span>
                <span>Followers</span>
              </div>
            </div>

            {/* Tweet */}
            <div className='flex items-center w-full p-4 border-b bg-white'>
              <div className="animate-pulse w-16 h-16 mx-4 bg-gray-200"></div>

              <div className="flex flex-col flex-grow ml-4">
                <div className="flex items-center">
                  <div className="animate-pulse text-gray-200 bg-gray-200 font-bold">username</div>
                  <div className="animate-pulse text-gray-200 bg-gray-200 ml-2 text-xs">a few seconds ago</div>
                </div>

                <div className="animate-pulse flex my-2 text-gray-200 bg-gray-200">.</div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center focus:outline-none text-xs text-gray-200">
                    <svg className="animate-pulse w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>

                    <div className="animate-pulse ml-1 text-gray-200 bg-gray-200 w-4 h-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-none flex flex-col w-64">
            {/*  */}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {data &&
        <div className="container flex mt-4 space-x-4">
          <div className="flex-none flex flex-col w-64">
            {/*  */}
          </div>

          <div className="flex-auto">
            {/* Profile */}
            <div className="flex justify-between items-center bg-white p-8 border-b">
              <div className="flex items-center space-x-8">
                <img className="w-36 h-36" src={data.user.image} />
                <div className="flex flex-col flex-auto space-y-4">
                  <div className="text-xl tracking-widest">{data.user.name}</div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div>
                  <button
                    onClick={() => setRespondent(data.user)}
                    className='flex-none w-32 mx-2 px-4 py-2 text-white border bg-black border-black hover:bg-white hover:text-black'
                  >
                    Chat
                  </button>
                </div>

                {session.user._id !== data.user._id &&
                  <button
                    onClick={data.user.isFollowing ? () => unfollow() : () => follow()}
                    className='flex-none w-32 mx-2 px-4 py-2 text-white border bg-black border-black hover:bg-white hover:text-black'
                  >
                    {data.user.isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                }
              </div>
            </div>

            {/* Selector */}
            <div className="flex w-full items-center mt-4 bg-gray-50">
              <button className="flex-1 flex justify-center items-center p-4 focus:outline-none space-x-2 bg-white">
                <span className="font-bold">{data.tweets.length}</span>
                <span>{data.tweets.length === 1 ? 'Tweet' : 'Tweets'}</span>
              </button>

              <button className="flex-1 flex justify-center items-center p-4 focus:outline-none space-x-2 text-gray-600 hover:bg-white hover:text-black">
                <span className="font-bold">{data.followersCount}</span>
                <span>Following</span>
              </button>

              <button className="flex-1 flex justify-center items-center p-4 focus:outline-none space-x-2 text-gray-600 hover:bg-white hover:text-black">
                <span className="font-bold">{data.followingCount}</span>
                <span>{data.followingCount === 1 ? 'Follower' : 'Followers'}</span>
              </button>
            </div>

            {/* Tweets */}
            <div className="flex flex-col w-full items-center mb-8">
              {data.tweets.length === 0 && <>
                <div className='flex items-center w-full p-4 border-b bg-white'>
                  <div className="flex flex-grow ml-4">
                    {data.user.name} hasn't posted yet.
                  </div>
                </div>
              </>}

              {data.tweets.map(tweet => <Tweet key={tweet._id} session={session} tweet={tweet} mutate={mutate} />)}
            </div>
          </div>

          <div className="flex-none flex flex-col w-64">
            {/*  */}
          </div>
        </div>
      }
    </Layout>
  );
}
