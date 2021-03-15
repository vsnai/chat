import Nav from './nav';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      <div className="flex-auto flex flex-col items-center bg-gray-100">
        {children}
      </div>
    </div>
  );
}
