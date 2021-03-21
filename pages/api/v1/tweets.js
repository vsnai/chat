import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {  
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
    const session = await getSession({ req });

    const follows = (await db.collection('follows').find({ follower: ObjectId(session.user._id) })
      .project({ _id: 0, following: 1 })
      .toArray())
      .map(f => ObjectId(f.following));

    const tweets = await db.collection('tweets').aggregate([
      {
        $match: {
          userId: { $in: [ObjectId(session.user._id), ...follows] }
        }
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

    res.status(200).json({ tweets });
  }
};
