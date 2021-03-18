import { useState, useEffect, useRef } from 'react';

export default function Message ({ user }) {
  const [input, setInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    if (isModalOpen) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  async function send () {
    const res = await fetch('/api/v1/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, user })
    });

    const data = await res.json();

    if (res.status === 201) {
      console.log('zinja nosuutiita');
      console.log(data);
    }

    setIsModalOpen(false);
    setInput('');
  }

  return <>
    {isModalOpen && <>
      <div className="absolute z-10 flex w-full min-h-screen top-0 left-0 bg-black opacity-25">
      </div>

      <div className="absolute z-20 flex justify-between items-center w-full min-h-screen top-0 left-0">
        <div className="flex justify-center items-center w-full">
          <div className="flex px-8 py-16 bg-white">
            <input
              className="w-96 px-4 py-2 border-0 border-b mr-4 border-gray-200 focus:border-black focus:ring-0"
              type="text"
              placeholder="Message..."
              onChange={e => setInput(e.target.value)}
              value={input}
              ref={inputRef}
            />

            <button
              className='flex mx-2 px-4 py-2 text-white border bg-black border-black hover:bg-white hover:text-black'
              onClick={() => send()}
            >Send</button>

            <button
              className='flex mx-2 px-4 py-2 text-white border bg-black border-black hover:bg-white hover:text-black'
              onClick={() => setIsModalOpen(false)}
            >Cancel</button>
          </div>
        </div>
      </div>
    </>
    }

    <button
      onClick={() => setIsModalOpen(true)}
      className='flex mx-2 px-4 py-2 text-white border bg-black border-black hover:bg-white hover:text-black'
    >
      Send Message
    </button>
  </>
}
