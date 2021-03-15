import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
  const session = await getSession({ req });
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    const tweets = await db.collection('tweets').find({ user_id: ObjectId(session.user.id) }).sort( { _id: -1 } ).toArray();

    res.status(200).json({ tweets });
  } else if (req.method === 'POST') {
    const { tweet } = req.body;

    const date = new Date();

    const { ops } = await db.collection('tweets').insertOne({
      user_id: ObjectId(session.user.id),
      content: tweet.content,
      createdAt: date,
      updatedAt: date
    });

    res.status(201).json({ latestTweet: ops[0] });
  } else if (req.method === 'PUT') {
    const { tweet } = req.body;

    await db.collection('tweets').findOneAndUpdate(
      { _id: ObjectId(tweet._id) },
      { $set: { content: tweet.content, updatedAt: new Date() } }
    );

    res.status(200).json({});
  } else if (req.method === 'DELETE') {
    const { tweet } = req.body;

    await db.collection('tweets').deleteOne({_id: ObjectId(tweet._id)});

    res.status(204).json({});
  }
};
