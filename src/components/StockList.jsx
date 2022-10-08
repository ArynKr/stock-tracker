import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';
import useStore from '../store';
import finnHub from '../apis/finnHub';

export const StockList = () => {
  const navigate = useNavigate();
  const { wishlist, setWishlist } = useStore();
  const [stocks, setStocks] = useState([]);

  const removeStock = (e, stockSymbol) => {
    setWishlist(wishlist.filter((prevSymbol) => prevSymbol !== stockSymbol));
    e.stopPropagation();
  };

  const handleStockClick = (stockSymbol) => {
    navigate(`/detail/${stockSymbol}`);
  };

  useEffect(() => {
    const wishlistSymbols = localStorage.getItem('wishlist');
    if (wishlistSymbols) setWishlist(wishlistSymbols?.split(','));
  }, []);

  useEffect(() => {
    console.log('wishlist', wishlist);
    let isMounted = true;
    const fetchData = async () => {
      try {
        // Fetching Data
        const responses = await Promise.all(
          wishlist.map((stock) =>
            finnHub.get('/quote', {
              params: {
                symbol: stock,
              },
            })
          )
        );

        // Formatting the responses data to some simple format
        const data = responses.map((response) => ({
          data: response.data,
          symbol: response.config.params.symbol,
        }));

        // Only set state if mounted
        if (isMounted) {
          setStocks(data);
        }
      } catch (err) {
        const deniedStockSymbol = err.config.params.symbol;
        if(err.response.status === 403) setWishlist(wishlist.filter((symbol) => symbol !== deniedStockSymbol));
        console.log(err.response);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [wishlist]);

  const ChangeIcon = ({ change }) => (change > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />);

  return (
    <div className="container mx-auto overflow-x-scroll rounded pb-2">
      <p className='my-6 text-3xl font-bold text-center'>Wishlist</p>
      <div className='max-h-[17rem] overflow-y-scroll'>
        <table className="leading-normal min-w-full">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="whitespace-nowrap px-3 py-1">Stock</th>
              <th className="whitespace-nowrap px-3 py-1">Current</th>
              <th className="whitespace-nowrap px-3 py-1">Change</th>
              <th className="whitespace-nowrap px-3 py-1">{'%'} Change</th>
              <th className="whitespace-nowrap px-3 py-1">Day High</th>
              <th className="whitespace-nowrap px-3 py-1">Day Low</th>
              <th className="whitespace-nowrap px-3 py-1">Day Open</th>
              <th className="whitespace-nowrap px-3 py-1">Prev. Close</th>
              <th></th>
            </tr>
          </thead>
          {stocks.length ? (
            stocks.map((stock, idx) => (
              <tbody className={`${idx % 2 ? 'bg-gray-100' : ''}`} key={stock.symbol}>
                <tr onClick={() => handleStockClick(stock.symbol)} className="group cursor-pointer">
                  <td className="text-center px-3 py-3">{stock.symbol}</td>
                  <td className="text-center px-3 py-3">{stock.data.c}</td>
                  <td className={`text-center px-3 py-3 ${stock.data.d > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="flex items-center justify-between max-w-[6rem] mx-auto">
                      {stock.data.d}
                      <ChangeIcon change={stock.data.d} />
                    </span>
                  </td>
                  <td className={`text-center px-3 py-3 ${stock.data.dp > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="flex items-center justify-between max-w-[6rem] mx-auto">
                      {stock.data.dp}
                      <ChangeIcon change={stock.data.dp} />
                    </span>
                  </td>
                  <td className="text-center px-3 py-3">{stock.data.h}</td>
                  <td className="text-center px-3 py-3">{stock.data.l}</td>
                  <td className="text-center px-3 py-3">{stock.data.o}</td>
                  <td className="text-center px-3 py-3">{stock.data.pc}</td>
                  <td className="text-center px-3 py-3">
                    <button
                      className="invisible text-xs px-1 rounded border-red-600 border-2 text-red-600 hover:bg-red-600 hover:text-white group-hover:visible"
                      onClick={(e) => removeStock(e, stock.symbol)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            ))
          ) : (
            <tbody>
              <tr>
                <td colSpan={100} className="text-center py-10 text-xl font-bold">
                  No stocks here. Add one to your wishlist
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};
