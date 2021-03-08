import { useRouter } from 'next/router';

export default function Nav ({ user }) {
  const router = useRouter();

  return (
    <nav className="flex container justify-between mx-auto">
      <button className="p-4" onClick={() => router.push('/')}>Home</button>
      <button className="p-4">{user.username}</button>
    </nav>
  );
}
