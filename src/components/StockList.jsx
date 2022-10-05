import React, { useEffect, useState } from 'react';
import { BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';
import useStore from '../store';
import finnHub from '../apis/finnHub';

export const StockList = () => {
  const { wishlist, setWishlist } = useStore();
  const [stocks, setStocks] = useState([]);

  const ChangeIcon = ({ change }) => (change > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />);

  useEffect(() => {
    setWishlist(['GOOGL', 'AMZN', 'MSFT']);
  }, []);

  useEffect(() => {
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
          console.log(data);
          setStocks(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [wishlist]);

  return (
    <div className="container mx-auto overflow-x-scroll rounded pb-2">
      <table className="leading-normal min-w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="whitespace-nowrap px-3 py-1 ">Stock</th>
            <th className="whitespace-nowrap px-3 py-1 ">Current</th>
            <th className="whitespace-nowrap px-3 py-1 ">Change</th>
            <th className="whitespace-nowrap px-3 py-1 ">{'%'} Change</th>
            <th className="whitespace-nowrap px-3 py-1 ">Day High</th>
            <th className="whitespace-nowrap px-3 py-1 ">Day Low</th>
            <th className="whitespace-nowrap px-3 py-1 ">Day Open</th>
            <th className="whitespace-nowrap px-3 py-1 ">Prev. Close</th>
          </tr>
        </thead>
        {stocks?.map((stock, idx) => (
          <tbody className={`${idx % 2 ? 'bg-gray-100' : ''}`} key={stock.symbol}>
            <tr>
              <td className="text-center px-3 py-1">{stock.symbol}</td>
              <td className="text-center px-3 py-1">{stock.data.c}</td>
              <td className={`text-center px-3 py-1 ${stock.data.d > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className="flex items-center justify-between">
                  {stock.data.d}
                  <ChangeIcon change={stock.data.d} />
                </span>
              </td>
              <td className={`text-center px-3 py-1 ${stock.data.dp > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className="flex items-center justify-between">
                  {stock.data.dp}
                  <ChangeIcon change={stock.data.dp} />
                </span>
              </td>
              <td className="text-center px-3 py-1">{stock.data.h}</td>
              <td className="text-center px-3 py-1">{stock.data.l}</td>
              <td className="text-center px-3 py-1">{stock.data.o}</td>
              <td className="text-center px-3 py-1">{stock.data.pc}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};
