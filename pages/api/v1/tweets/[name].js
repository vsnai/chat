import { connectToDatabase } from '../../../../util/mongodb';

export default async (req, res) => {  
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();

    const { name } = req.query;

    const user = await db.collection('users').findOne({ name });
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

    // const user = (await db.collection('users').aggregate([
    //   {
    //     $match: { name }
    //   },
    //   {
    //     $lookup: {
    //       from: 'tweets',
    //       localField: '_id',
    //       foreignField: 'userId',
    //       as: 'tweets'
    //     }
    //   }
    // ])
    //   .sort({ updatedAt: -1 })
    //   .toArray())[0];

    res.status(200).json({ user, tweets });
  }
};
