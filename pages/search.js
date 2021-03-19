import { useRouter } from 'next/router';

import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../util/mongodb';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Layout from '../components/layout';

export default function Search({ session, _users, _follows }) {
  dayjs.extend(relativeTime);
  const router = useRouter();

  async function follow (user) {
    const res = await fetch('/api/v1/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });

    if (res.status === 201) {
      router.reload();
    }
  }

  async function unfollow (user) {
    const res = await fetch('/api/v1/follow', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });

    if (res.status === 204) {
      router.reload();
    }
  }

  function isFollowing (user) {
    return !! _follows.find(f => f.following === user._id);
  }

  return (
    <Layout>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center w-1/2 my-4 bg-white p-2 border-b">
          {_users.length > 0
            ? _users.map(user => {
              return <div key={user._id} className="flex items-center w-full hover:bg-gray-100">
                <button className="flex flex-auto items-center space-x-4 p-2" onClick={() => router.push(`/${user.name}`)}>
                  <img className="w-16 h-16 rounded-full" src={user.image} />
                  <div>{user.name}</div>
                </button>

                {session.user._id !== user._id && <button
                  onClick={isFollowing(user) ? () => unfollow(user) : () => follow(user)}
                  className='flex-none mx-2 px-4 py-2 text-white border bg-black border-black hover:bg-white hover:text-black'
                >
                  {isFollowing(user) ? 'Unfollow' : 'Follow'}
                </button>
                }
              </div>
            })
            : <div>No users found!</div>
          }
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req, query }) {
  const session = await getSession({ req });

  if (! session) {
    return {
      redirect: {
        permanent: false,
        destination: '/api/auth/signin'
      }
    }
  }

  const { db } = await connectToDatabase();

  const q = query.q.replace(/[^a-z]/gi, '');

  const users = await db.collection('users').find({ name: {'$regex': new RegExp(q) } }).toArray();
  const follows = await db.collection('follows').find({ follower: ObjectId(session.user._id) }).toArray();

  return {
    props: {
      session,
      _users: JSON.parse(JSON.stringify(users)),
      _follows: JSON.parse(JSON.stringify(follows)),
    }
  };
}
