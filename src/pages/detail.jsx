import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import finnHub from '../apis/finnHub';

export const StockDetail = () => {
  const {stockSymbol: symbol} = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const date = new Date()
      const currentTime = Math.floor(date.getTime() / 1000)
      const from = currentTime - 24 * 60 * 60
      const to = currentTime
      const response = await finnHub.get('/stock/candle', {
        params: {
          symbol,
          from,
          to,
          resolution: 30
        }
      })
      console.log(response);
    }
    fetchData()
  }, [symbol])

  return <div>detail for {symbol}</div>;
};
