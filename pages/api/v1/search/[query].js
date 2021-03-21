import { getSession } from 'next-auth/client';
import { connectToDatabase } from '../../../../util/mongodb';

export default async (req, res) => {
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
    const session = await getSession({ req });
    const { query } = req.query;

    const results = (await db.collection('users').aggregate([
      {
        $match: {
          name: {'$regex': new RegExp(query) },
        }
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'following',
          as: 'followers',
        },
      }
    ]).toArray())
      .map(({ _id, name, email, image, followers }) => {
        return {
          _id,
          name,
          email,
          image,
          isFollowing: followers.findIndex(f => f.follower.toString() === session.user._id) !== -1
        };
      });

    res.status(200).json({ results });
  }
}
