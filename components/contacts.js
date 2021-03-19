import { useState, useEffect, useContext } from 'react';
import { RespondentContext } from '../contexts/RespondentContext';

export default function Contacts () {
  const { respondent, setRespondent } = useContext(RespondentContext);

  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function fetchContacts () {
      setIsLoading(true);

      const res = await fetch('/api/v1/contacts');
  
      if (res.status === 200) {
        const { contacts } = await res.json();
    
        setContacts(contacts);
      }
  
      setIsLoading(false);
    }

    fetchContacts();
  }, []);

  if (! isLoading && contacts.length === 0) {
    return <>No contacts...</>;
  }

  if (contacts.length > 0) {
    return (
      <div className="flex flex-col bg-white border-b">
        {contacts.map(contact =>
          <button
            key={contact._id}
            className="flex items-center space-x-2 p-4 hover:bg-gray-50 focus:outline-none"
            onClick={() => setRespondent(contact)}
          >
            <img className="w-8 h-8" src={contact.image} />
            <div className="">{contact.name}</div>
          </button>
        )}
      </div>
    );
  }

  return <>Loading...</>;
}
