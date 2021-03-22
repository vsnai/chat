import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useSession } from 'next-auth/client';

import Layout from '../components/layout';
import Tweet from '../components/tweet';
import Contacts from '../components/contacts';

export default function Home () {
  const router = useRouter();

  const [session, loading] = useSession();
  const { data, error, mutate } = useSWR(! loading && '/api/v1/tweets', (...args) => fetch(...args).then(res => res.json()));

  const [selectedTweet, setSelectedTweet] = useState({ _id: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      router.push('/api/auth/signin');
    }
  }, [error]);

  async function add () {
    if (selectedTweet.content === '') {
      return;
    }

    setIsLoading(true);

    const res = await fetch('/api/v1/tweet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet: selectedTweet })
    });

    if (res.status === 201) {
      mutate();
    }

    setIsLoading(false);
    setSelectedTweet({ _id: '', content: '' });
  }

  return (
    <Layout>
      {data &&
        <div className="container flex mt-4 space-x-4">
          <aside className="flex-none flex flex-col w-64">
            {/*  */}
          </aside>

          <div className="flex-auto">
            <div className="flex justify-between">
              <input
                className="flex-auto px-4 py-2 border-0 border-b mr-4 border-gray-200 focus:border-black focus:ring-0"
                type="text"
                placeholder="Say Something..."
                onChange={e => setSelectedTweet({ ...selectedTweet, content: e.target.value })}
                value={selectedTweet.content}
              />

              <button
                onClick={() => add()}
                className={`flex-none w-32 px-4 py-2 text-white border ${isLoading || selectedTweet.content === '' ? 'text-gray-300 bg-gray-100 border-gray-300 point cursor-default' : 'bg-black border-black hover:bg-white hover:text-black'}`}
                disabled={isLoading || selectedTweet.content === ''}
              >Add</button>
            </div>

            <div className="flex flex-col items-center mt-4 mb-8">
              {data.tweets.map(tweet => <Tweet key={tweet._id} session={session} tweet={tweet} mutate={mutate} />)}
            </div>
          </div>

          <aside className="flex-none flex flex-col w-64">
            <Contacts />
          </aside>
        </div>
      }
    </Layout>
  );
}
