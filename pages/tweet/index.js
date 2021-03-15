import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useSession, getSession } from 'next-auth/client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Layout from '../../components/layout';

export default function Tweet() {
  dayjs.extend(relativeTime);
  const router = useRouter();

  const [session, loading] = useSession();
  const [user, setUser] = useState({});
  const [tweets, setTweets] = useState([]);
  const [selectedTweet, setSelectedTweet] = useState({ _id: '', content: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData () {
      const session = await getSession();

      if (! session) {
        router.push('/');

        return;
      }

      setUser(session.user);

      const res = await fetch('/api/v1/tweet');
      const json = await res.json();

      setTweets(json.tweets);
    }

    fetchData();
  }, [])

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

    const { latestTweet } = await res.json();

    if (res.status === 201) {
      setTweets([latestTweet, ...tweets]);
    }

    setIsLoading(false);
    setSelectedTweet({ _id: '', content: '' });
  }

  async function edit () {
    setIsLoading(true);

    const res = await fetch('/api/v1/tweet', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet: selectedTweet })
    });

    if (res.status === 200) {
      const currentTweet = tweets.find(t => t._id === selectedTweet._id);

      currentTweet.content = selectedTweet.content;
      currentTweet.updatedAt = new Date();

      setTweets([...tweets]);
    }

    setIsLoading(false);
    setIsEditMode(false);
    setSelectedTweet({ _id: '', content: '' });
  }

  async function remove (tweet) {
    const res = await fetch('/api/v1/tweet', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet })
    });

    if (res.status === 204) {
      setTweets([...tweets.filter(t => t._id !== tweet._id)]);
    }
  }

  function enterEditMode (tweet) {
    setIsEditMode(true);

    setSelectedTweet({ ...tweet });
  }

  function exitEditMode () {
    setIsEditMode(false);

    setSelectedTweet({ _id: '', content: '' });
  }

  async function like (tweet) {
    const res = await fetch('/api/v1/like', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet })
    });

    if (res.status === 200) {
      const currentTweet = tweets.find(t => t._id === tweet._id);

      if (currentTweet.likedBy.indexOf(session.user.id) === -1) {
        currentTweet.likedBy.push(session.user.id);
      }

      setTweets([...tweets]);
    }
  }

  async function dislike (tweet) {
    const res = await fetch('/api/v1/like', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet })
    });

    if (res.status === 204) {
      tweets.find(t => t._id === tweet._id).likedBy = tweet.likedBy.filter(item => item !== session.user.id);

      setTweets([...tweets]);
    }
  }

  return (
    <Layout>
      <div className="flex justify-between w-1/2 mt-8 mb-4">
        <input
          className="w-5/6 px-4 py-2 border-0 border-b mr-4 border-gray-200 focus:border-black focus:ring-0"
          type="text"
          placeholder="Say Something..."
          onChange={e => setSelectedTweet({ ...selectedTweet, content: e.target.value })}
          value={selectedTweet.content}
        />

        <button
          onClick={isEditMode ? () => edit() : () => add()}
          className={`flex-grow px-4 py-2 text-white border ${isLoading || selectedTweet.content === '' ? 'text-gray-300 bg-gray-100 border-gray-300 point cursor-default' : 'bg-black border-black hover:bg-white hover:text-black'}`}
          disabled={isLoading || selectedTweet.content === ''}
        >{isEditMode ? 'Edit' : 'Add'}</button>   

        {isEditMode && <button
          onClick={() => exitEditMode()}
          className="flex-none ml-2 px-4 py-2 bg-red-500 text-white hover:bg-white hover:text-black"
        >X</button>}
      </div>

      <div className="flex flex-col w-full items-center mb-8">
      {tweets.length > 0 && tweets.map(tweet => {
        return <div
          key={tweet._id}
          className='flex justify-between items-center w-1/2 px-8 py-4 border-b bg-white hover:bg-gray-50'
        >
          <div className="flex flex-auto">
            <img className="w-12 h-12 rounded-full" src={user.image} />

            <div className="flex flex-col flex-grow ml-4">
              <div className="flex items-center">
                <button onClick={() => router.push(`/${user.name}`)} className="font-bold">{user.name}</button>
                <div className="ml-2 text-xs text-gray-300">
                  {dayjs(tweet.updatedAt).isSame(dayjs(tweet.createdAt))
                    ? dayjs(tweet.createdAt).fromNow()
                    : `${dayjs(tweet.updatedAt).fromNow()} (edited)`
                  }
                </div>
              </div>

              <div className="my-2">{tweet.content}</div>

              <div className="flex space-x-4">
                {!tweet.likedBy.includes(session.user.id) &&
                  <button className="flex focus:outline-none text-xs text-gray-300 hover:text-red-300" onClick={() => like(tweet)}>
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>

                    <div className="ml-1">{tweet.likedBy.length}</div>
                  </button>
                }

                {tweet.likedBy.includes(session.user.id) &&
                  <button className="flex focus:outline-none text-xs text-red-500 hover:text-gray-300" onClick={() => dislike(tweet)}>
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>

                    <div className="ml-1">{tweet.likedBy.length}</div>
                  </button>
                }

                <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => console.log(tweet)}>Show</button>
                <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => enterEditMode(tweet)}>Edit</button>
                <button className="focus:outline-none text-xs text-gray-300 hover:text-black" onClick={() => remove(tweet) }>Delete</button>
              </div>
            </div>
          </div>
        </div>
      })}
      </div>
    </Layout>
  );
}
