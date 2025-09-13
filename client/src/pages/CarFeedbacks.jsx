import React from 'react';
import { useAppContext } from '../context/AppContext';
import Title from '../components/owner/Title';
import FeedbackList from '../components/FeedbackList';

const CarFeedbacks = () => {
  const { cars } = useAppContext();

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Car Feedbacks" subTitle="View feedback and ratings for all cars with feedback." />
      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6 bg-white'>
        {cars.filter(car => car.feedbackCount > 0).length === 0 ? (
          <div className="p-6 text-center text-gray-400">No cars with feedback found.</div>
        ) : (
          cars.filter(car => car.feedbackCount > 0).map(car => (
            <div key={car._id} className="border-b border-borderColor p-4">
              <div className="flex items-center gap-4 mb-2">
                <img src={car.image} alt="" className="h-10 w-10 rounded-md object-cover" />
                <span className="font-semibold">{car.brand} {car.model}</span>
              </div>
              <FeedbackList carId={car._id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CarFeedbacks;
