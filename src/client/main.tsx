import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

const useApp = () => {
  const [search, setSearch] = useState<string>();
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    if (!search?.length) {
      setList([]);
      return;
    }
    axios.get(`/${search}`).then(x => setList(x.data));
  }, [search]);

  return { search, setSearch, list };
};

const App = () => {
  const { list, search, setSearch } = useApp();
  return (
    <div className="container">
      <input
        className="search"
        type={'search'}
        placeholder="Search for word"
        value={search}
        onChange={x => setSearch(x.target.value)}
      />
      <div className="count">{list.length.toLocaleString()} words</div>
      <div className="list">
        {list.slice(0, 1000).map(word => (
          <div style={{ cursor: 'pointer' }} onClick={() => setSearch(word)}>
            {word}
          </div>
        ))}
        {list.length > 1000 && <div>...</div>}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
