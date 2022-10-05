import React from 'react';
import { Search, StockList } from '../components';

export const AppHome = () => {
  return (
    <div className="px-3 flex flex-col gap-36">
      <Search />
      <StockList />
    </div>
  );
};
