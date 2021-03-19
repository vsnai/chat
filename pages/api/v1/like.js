import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
  const session = await getSession({ req });
  const { db } = await connectToDatabase();

  if (req.method === 'PUT') {
    const { tweet } = req.body;

    await db.collection('tweets').findOneAndUpdate(
      { _id: ObjectId(tweet._id) },
      { $addToSet: { likedBy: ObjectId(session.user._id) } }
    );

    res.status(200).json({});
  } else if (req.method === 'DELETE') {
    const { tweet } = req.body;

    await db.collection('tweets').findOneAndUpdate(
      { _id: ObjectId(tweet._id) },
      { $pull: { likedBy: ObjectId(session.user._id) } }
    );

    res.status(204).json({});
  }
};