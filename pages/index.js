import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const [session, loading] = useSession();

  if (! loading) {
    if (session) {
      router.push('/tweet');
    } else {
      signIn();
    }
  }

  return <div className="flex justify-center items-center min-h-screen">
    <h1 className="text-9xl">
      <span className="text-transparent bg-gradient-to-r bg-clip-text from-blue-500 to-red-500">Loading ...</span>
    </h1>
  </div>;
}
