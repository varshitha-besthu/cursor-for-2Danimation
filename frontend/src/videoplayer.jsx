import React from 'react';

const VideoPlayer = ({url}) => {
  {if(url == ""){
    return <div>No video yet</div>
  }}
  const cloudinaryUrl = url; 

  return (
    <div>
      <h2>Cloudinary Video</h2>
      <video width="600" controls>
        <source src={cloudinaryUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
