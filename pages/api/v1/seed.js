import { connectToDatabase } from '../../../util/mongodb';

export default async (req, res) => {
  const { db } = await connectToDatabase();

  await db.collection('properties').drop();
  const { ops } = await db.collection('properties').insertMany([
    {
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1946&q=80",
      ],
      city: "Riga",
      size: 500,
      price: 150000
    },
    {
      images: [
        "https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80",
      ],
      city: "Jelgava",
      size: 1000,
      price: 200000
    },
  ]);

  res.status(201).json({ data: ops });
};
