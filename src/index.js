import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Skeleton,{ SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon
} from "react-share";
import axios from 'axios';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ImageComponent />
  </React.StrictMode>
);



function ImageComponent() {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageId, setImageId] = useState(null); 
  const [shareURL, setShareURL] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({ x: event.clientX - rect.left + 80, y: event.clientY - rect.top - 25 });
  }

  function getRandomAspectRatio() {
    const randomNumber = Math.random();
    if (randomNumber < 0.25) {
      return '1080/1080'; // Square
    } else if (randomNumber < 0.5) {
      return '1440/1080'; // Standard
    } else if (randomNumber < 0.75) {
      return '720/1080'; // Widescreen
    } else {
      return '2160:1080'; // Panoramic
    }
  }

  const updateShareURL = (size) => {
    axios.get(`https://picsum.photos/id/${imageId}/${size}`)
      .then(function (response) {
        if(response.status === 200)
        {setShareURL(response.data.url)}
        else {
          console.warn("Error: ", response.status);
        }})
      .catch(function (error) {console.warn(error);})
  }


  const updateImage = () => {
    setIsLoading(true);
    let size = getRandomAspectRatio();
    axios
      .get(`https://picsum.photos/${size}`)
      .then(function (response) {
        if(response.status === 200)
        {
          setImageId(response.headers["picsum-id"]);
          setImageUrl(`https://picsum.photos/id/${imageId}/${size}`);
          updateShareURL(size);
        }
      })
      .then(function () {setIsLoading(false);})
      .catch(function (error) {
        if (error.message.includes('Network Error')) {
          console.warn("Network Error");
        }
        else {
          console.warn("Error: ", error);
        setTimeout(updateImage, 1000);
        }
      });
  }

  useEffect(function () {
    updateImage();
  }, []);

  return (
      <div className='container' >
        <SkeletonTheme baseColor="#595959" highlightColor="#bfbfbf" >
          <div className="picture tooltip" onMouseMoveCapture={(event)=>{handleMouseMove(event)}}>
          <span className="tooltiptext" style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>Click on me to refresh</span>
            {isLoading ? <Skeleton  height={'75vh'} width={'50vw'}/> :
            <img src={imageUrl} alt="randomImage" id="image-preview" onClick={updateImage} />}
          </div>
          <div className="share">
            {(shareURL!==null)?
            <>
            <FacebookShareButton title='Click to Share' url={imageUrl} >
              <FacebookIcon size={48} round={false} />
            </FacebookShareButton>
            </>:<Skeleton height={48} width={48} />}
            {(shareURL!==null)?
            <>
            <TwitterShareButton title='Click to Share' url={shareURL} >
              <TwitterIcon size={48} round={false} />
            </TwitterShareButton>
            </>:<Skeleton height={48} width={48} />}
            {(shareURL!==null)?
            <>
            <WhatsappShareButton title='Click to Share' url={shareURL} >
              <WhatsappIcon size={48} round={false}/>
            </WhatsappShareButton>
            </>
            :<Skeleton height={48} width={48} />}
          </div>
        </SkeletonTheme>
      </div>
    )
}

