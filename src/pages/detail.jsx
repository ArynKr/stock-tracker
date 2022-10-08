import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import finnHub from '../apis/finnHub';
import { StockChart } from '../components';

const SECONDS_IN_ONE_DAY = 24 * 60 * 60;

export const StockDetail = () => {
  const { stockSymbol: symbol } = useParams();
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState(null);

  const formatData = useCallback((data) => {
    return data.t.map((timestamp, idx) => ({
      x: timestamp * 1000,
      y: Math.floor(data.c[idx]),
    }));
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const date = new Date();
        const currentTime = Math.floor(date.getTime() / 1000);
        const [fromDay, fromWeek, fromYear] = [
          date.getDay() === 6 ? currentTime - 2 * SECONDS_IN_ONE_DAY : date.getDay() === 0 ? currentTime - 3 * SECONDS_IN_ONE_DAY : currentTime - SECONDS_IN_ONE_DAY,
          currentTime - 7 * SECONDS_IN_ONE_DAY,
          currentTime - 365 * SECONDS_IN_ONE_DAY,
        ];
        const to = currentTime;
        const responses = await Promise.all([
          finnHub.get('/stock/candle', {
            params: {
              symbol,
              from: fromDay,
              to,
              resolution: 30,
            },
          }),
          finnHub.get('/stock/candle', {
            params: {
              symbol,
              from: fromWeek,
              to,
              resolution: 60,
            },
          }),
          finnHub.get('/stock/candle', {
            params: {
              symbol,
              from: fromYear,
              to,
              resolution: 'W',
            },
          }),
        ]);
        if (isMounted) {
          setStockData({
            day: formatData(responses[0].data),
            week: formatData(responses[1].data),
            year: formatData(responses[2].data),
          });
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    return () => (isMounted = false);
  }, [symbol]);

  return (
    <div className="container mx-auto px-2">
      
      <div className='mt-8 flex flex-col gap-8'>
        <Link to="/" className='border-2 w-min rounded px-2 border-blue-400 hover:bg-blue-400 text-blue-400 hover:text-white transition-colors'>Back</Link>
        <div>{!loading && <StockChart stockData={stockData} symbol={symbol} />}</div>
      </div>
    </div>
  );
};
