import React, { useEffect, useState } from 'react';
import finnHub from '../apis/finnHub';

export const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const requestSearch = async () => {
      try {
        const { data } = await finnHub.get('/search', {
          params: {
            q: searchText,
          },
        });
        console.log(data);
        if (isMounted) setSearchResults(data.result);
      } catch (err) {
        console.log(err);
      }
    };
    if (searchText) requestSearch();
    else setSearchResults(null);

    return () => (isMounted = false);
  }, [searchText]);

  const SearchResult = () => {
    if (!searchResults) return null;
    return (
      <div className="absolute border-2 w-full border-t-0 px-4 py-1 backdrop-blur-lg max-h-[50vh] overflow-y-auto">
        <ul>
          {searchResults.map((stock) => (
            <li>{stock.description}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="relative">
        <input
          type="text"
          id="search"
          placeholder="Search"
          autoComplete="off"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full focus:border-blue-200 border-2 border-gray-100 outline-none transition-colors duration-300 rounded px-4 py-1"
        />
        <SearchResult />
      </div>
    </div>
  );
};
