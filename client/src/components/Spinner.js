import React from 'react';

const Spinner = () => {
  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black opacity-70'>
      <div className='w-20 h-20 border-white border-dashed rounded-full border-t-transparent animate-spin'></div>
    </div>
  );
};

export default Spinner;
