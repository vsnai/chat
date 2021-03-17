import { useRouter } from 'next/router';

import { connectToDatabase } from '../util/mongodb';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Layout from '../components/layout';

export default function Search({ _users }) {
  dayjs.extend(relativeTime);
  const router = useRouter();

  return (
    <Layout>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center w-1/2 my-4 bg-white p-2 border-b">
          {_users.length > 0
            ? _users.map(user => {
              return <button key={user._id} className="flex items-center w-full space-x-4 hover:bg-gray-100 p-2" onClick={() => router.push(`/${user.name}`)}>
                <img className="w-16 h-16 rounded-full" src={user.image} />
                <div>{user.name}</div>
              </button>
            })
            : <div>No users found!</div>
          }
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const { db } = await connectToDatabase();

  const users = await db.collection('users').find({ name: {'$regex': new RegExp(`${query.q}`) } }).toArray();

  return {
    props: {
      _users: JSON.parse(JSON.stringify(users))
    }
  };
}
