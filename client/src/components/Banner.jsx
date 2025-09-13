import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'

const Banner = () => {
  return (
    <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden'>

        <div className='text-white'>
            <h2 className='text-3xl font-medium'>Do You Own a Luxury Car?</h2>
            <p className='mt-2'>Monetize your vehicle effortlessly by listing it on CarRental.</p>
            <p className='max-w-130'>We take care of insurance, driver verification and secure payments — so you can earn passive income, stress-free.</p>

            <div className='mt-6 mb-2'>
              <label htmlFor="pickup-location" className="block mb-1 font-semibold">Pickup Location</label>
              <select id="pickup-location" className="text-gray-700 rounded-lg px-4 py-2 w-full max-w-xs">
                <option value="koderma">Koderma</option>
                <option value="ranchi">Ranchi</option>
                <option value="jamshedpur">Jamshedpur</option>
                <option value="bokaro">Bokaro</option>
              </select>
            </div>

            <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='px-6 py-2 bg-white hover:bg-slate-100 transition-all text-primary rounded-lg text-sm mt-4 cursor-pointer'>List your car</motion.button>
        </div>

        <motion.img 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        src={'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1152&q=80'} alt="car" className='max-h-45 mt-10'/>
      
    </motion.div>
  )
}

export default Banner
