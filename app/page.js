'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('https://dummyjson.com/products');
  const [errorUrl, setErrorUrl] = useState(false);
  const [res, setRes] = useState({});

  const makeRequest = async () => {
    try {
      const res = await fetch(`/cache?url=${url}`, {
        method: 'GET',
      });
      const json = await res.json();
      setRes(json);
    } catch (e) {
      setRes(e);
    }
  };

  const clearCache = async () => {
    try {
      const res = await fetch(`/cache?clear-cache=true`, {
        method: 'GET',
      });
      const json = await res.json();
      setRes(json);
    } catch (e) {
      setRes(e);
    }
  };
  const sendRequest = async () => {
    setErrorUrl(false);
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      setErrorUrl(true);
    }

    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      setErrorUrl(false);
      await makeRequest();
    } else {
      setErrorUrl(true);
    }
  };
  return (
    <div className='flex min-h-screen w-full flex-col'>
      <main className='flex min-h-screen w-full flex-col gap-4 p-4'>
        <div className='flex w-full items-center gap-2'>
          <label className='text-xl font-bold' htmlFor='url-input'>
            URL
          </label>
          <input
            className={`w-11/12 rounded-lg border-2 border-black p-2 text-xl text-black ${
              errorUrl ? 'border-red-600 bg-red-400' : ''
            }`}
            value={url}
            onChange={(ev) => setUrl(ev.target.value)}
          ></input>
        </div>
        <div className='flex w-full items-center justify-center gap-2'>
          <button
            className='w-1/3 rounded-xl border-2 border-black bg-blue-400 p-4 font-bold'
            onClick={sendRequest}
          >
            Send
          </button>
          <button
            className='w-1/3 rounded-xl border-2 border-black bg-gray-200 p-4 font-bold text-black'
            onClick={clearCache}
          >
            Clear Cache
          </button>
        </div>
        <pre>
          <code>{JSON.stringify(res, null, 4)}</code>
        </pre>
      </main>
    </div>
  );
}
