import { getSession } from 'next-auth/client';
import { connectToDatabase } from '../../../../util/mongodb';

export default async (req, res) => {  
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
    const session = await getSession({ req });
    const { name } = req.query;

    const user = (await db.collection('users').aggregate([
      {
        $match: { name }
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'following',
          as: 'followers',
        },
      }
    ])
      .toArray())
      .map(({ _id, name, email, image, followers }) => {
        return {
          _id,
          name,
          email,
          image,
          isFollowing: followers.findIndex(f => f.follower.toString() === session.user._id) !== -1
        };
      })[0];

    const tweets = await db.collection('tweets').aggregate([
      {
        $match: { userId: user._id }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      }
    ])
      .sort({ updatedAt: -1 })
      .toArray();

  const followersCount = await db.collection('follows').find({ follower: user._id }).count();
  const followingCount = await db.collection('follows').find({ following: user._id }).count();

    res.status(200).json({
      user,
      tweets,
      followersCount,
      followingCount
    });
  }
};
