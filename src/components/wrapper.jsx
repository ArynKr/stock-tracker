import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import logo from '../assets/logo.svg'

const Wrapper = () => {
  return (
    <div className='min-h-screen flex justify-between flex-col'>
      <Link to="/" className='my-2 w-full'>
        <img className='mx-auto' src={logo} width="100" />
        <h1 className='text-center font-bold text-4xl'>Trade</h1>
        <p className='text-center font-medium '>Space</p>
      </Link>
      <Outlet />
      <div className="py-2 px-8 bg-gray-300 text-black font-medium w-full mt-10">
        <footer className='container mx-auto '>
          <p className='text-left'>Made By <a className='font-bold underline' href="https://www.aryankumar.in" target="_blank" rel="noreferrer">Aryan Kr.</a></p>
        </footer>
      </div>
    </div>
  )
}

export default Wrapper