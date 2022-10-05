import React, { useEffect } from 'react';
import useStore from '../store';
import finnHub from '../apis/finnHub';

export const StockList = () => {
  const { wishlist, setWishlist } = useStore();

  useEffect(() => {
    setWishlist(['GOOGL', 'AMZ', 'MSFT']);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          wishlist.map((stock) =>
            finnHub.get('/quote', {
              params: {
                symbol: stock,
              },
            })
          )
        );
        console.log(responses);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {wishlist?.map((stockSymbol) => (
        <p key={stockSymbol}>{stockSymbol}</p>
      ))}
    </div>
  );
};
