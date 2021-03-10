import { useRouter } from 'next/router';

export default function Nav ({ user }) {
  const router = useRouter();

  return (
    <nav className="flex container justify-between mx-auto">
      <button className="p-4" onClick={() => router.push('/tweet')}>Home</button>
      <button className="p-4" onClick={() => router.push('/account')}>{user.username}</button>
    </nav>
  );
}
