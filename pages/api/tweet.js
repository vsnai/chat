import { ObjectId } from 'mongodb';
import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
  if (req.method === 'POST') {
    const { db } = await connectToDatabase();

    const { userId, tweetBody } = req.body;

    await db.collection('tweets').insertOne({
      user_id: ObjectId(userId),
      body: tweetBody,
      inserted_at: new Date(),
      updated_at: null
    });
  
    res.status(201).json({});
  } else if (req.method === 'PUT') {
    const { db } = await connectToDatabase();

    const { userId, tweetId, tweetBody } = req.body;

    await db.collection('tweets').findOneAndUpdate(
      { "_id": ObjectId(tweetId) },
      { $set: { body: tweetBody, updated_at: new Date() } }
    );

    res.status(200).json({});
  } else if (req.method === 'DELETE') {
    const { db } = await connectToDatabase();

    const { tweet } = req.body;

    await db.collection('tweets').deleteOne({"_id": ObjectId(tweet._id)});

    res.status(204).json({});
  }
};
