import { getSession } from 'next-auth/client';

export default function ServerSide ({ session }) {
  return <>Signed in as {session.user.email}</>;
}

export async function getServerSideProps ({ req }) {
  const session = await getSession({ req });

  if (! session) {
    return {
      redirect: {
        permanent: false,
        destination: '/api/auth/signin'
      }
    }
  }

  return {
    props: { session }
  }
}
