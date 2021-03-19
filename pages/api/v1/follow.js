import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
  const session = await getSession({ req });
  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    const { user } = req.body;

    const result = await db.collection('follows').findOne({
      follower: ObjectId(session.user._id),
      following: ObjectId(user._id)
    });

    if (session.user._id !== user._id && ! result) {
      await db.collection('follows').insertOne({
        follower: ObjectId(session.user._id),
        following: ObjectId(user._id)
      });

      res.status(201).json({});
    } else {
      res.status(400).json({});
    }
  } else if (req.method === 'DELETE') {
    const { user } = req.body;

    const result = await db.collection('follows').findOne({
      follower: ObjectId(session.user._id),
      following: ObjectId(user._id)
    });

    if (session.user._id !== user._id && result) {
      await db.collection('follows').deleteOne({ _id: result._id });

      res.status(204).json({});
    } else {
      res.status(400).json({});
    }
  }
};