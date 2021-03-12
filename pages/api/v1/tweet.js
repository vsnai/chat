import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { db } = await connectToDatabase();

    const { user, tweet } = req.body;

    await db.collection('tweets').insertOne({
      user_id: ObjectId(user._id),
      content: tweet.content,
      inserted_at: new Date(),
      updated_at: null
    });

    res.status(201).json({});
  } else if (req.method === 'PUT') {
    const { db } = await connectToDatabase();

    const { user, tweet } = req.body;

    await db.collection('tweets').findOneAndUpdate(
      { _id: ObjectId(tweet._id) },
      { $set: { content: tweet.content, updated_at: new Date() } }
    );

    res.status(200).json({});
  } else if (req.method === 'DELETE') {
    const { db } = await connectToDatabase();

    const { user, tweet } = req.body;

    await db.collection('tweets').deleteOne({_id: ObjectId(tweet._id)});

    res.status(204).json({});
  }
};
