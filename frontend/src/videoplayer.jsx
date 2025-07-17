import React from 'react';

const VideoPlayer = ({url}) => {
  {if(url == ""){
    return <div>No video yet</div>
  }}
  const cloudinaryUrl = url; 

  return (
    <div className='flex justify-center mt-4 mb-4'>
      <video width="800" controls>
        <source src={cloudinaryUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
