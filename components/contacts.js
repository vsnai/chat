import { useContext } from 'react';
import { RespondentContext } from '../contexts/RespondentContext';
import useSWR from 'swr';

export default function Contacts () {
  const { setRespondent } = useContext(RespondentContext);

  const { data } = useSWR('/api/v1/contacts', (...args) => fetch(...args).then(res => res.json()));

  if (! data) {
    return <>Loading ...</>;
  }

  if (data && data.contacts.length === 0) {
    return <>No contacts...</>;
  }

  return (
    <div className="flex flex-col bg-white border-b">
      {data.contacts.map(contact =>
        <button
          key={contact._id}
          className="flex items-center space-x-4 p-4 bg-white hover:bg-gray-50 focus:outline-none"
          onClick={() => setRespondent(contact)}
        >
          <img className="w-8 h-8" src={contact.image} />
          <div className="">{contact.name}</div>
        </button>
      )}
    </div>
  );
}
