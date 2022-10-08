import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'

export const StockChart = ({stockData, symbol}) => {
  const {day, week, year} = stockData
  const [interval, setInterval] = useState(day)
  const color = interval[interval.length - 1].y - interval[0].y > 0 ? '#26C281' : '#ED3419'

  const options = {
    colors: [color],
    title: {
      text: symbol,
      align: "center",
      style: {
        fontSize: '24px'
      }
    },
    chart: {
      id: "stock data",
      animations: {
        speed: 1300
      }
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false
      }
    },
    tooltip: {
      x: {
        format: "MMM dd HH:MM"
      }
    }
  }

  const series = [{
    name: symbol,
    data: interval
  }]

  useEffect(() => {
    console.log(stockData)
  }, [stockData])
  
  return (
    <div>
      <div>
        <Chart options={options} series={series} type="area" width='100%' />
      </div>
      <div className='flex gap-2 text-sm px-4'>      
        <button className={`border-blue-500 border-2 px-2 rounded outline-none transition-color ${interval===day ? 'bg-blue-500 text-white' : 'text-blue-500'}`} onClick={() => setInterval(day)}>
          24H
        </button>
        <button className={`border-blue-500 border-2 px-2 rounded outline-none transition-color ${interval===week ? 'bg-blue-500 text-white' : 'text-blue-500'}`} onClick={() => setInterval(week)}>
          7D
        </button>
        <button className={`border-blue-500 border-2 px-2 rounded outline-none transition-color ${interval===year ? 'bg-blue-500 text-white' : 'text-blue-500'}`} onClick={() => setInterval(year)}>
          1Y
        </button>
      </div>
    </div>
  )
}