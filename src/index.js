import React, { useEffect } from 'react';
import { useState } from 'react';
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


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [randomImage, setRandomImage] = useState('');

  const [imageData, setImageData] = useState(null);

  useEffect(() => {image()},[])

  function image() {
    setIsLoading(true)
    fetch('https://picsum.photos/450/720')
      .then(response => {
        setRandomImage(response.url)
        const xhr = new XMLHttpRequest();
        xhr.open('GET', response.url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
          if (xhr.status === 200) {
            const blob = new Blob([xhr.response], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            setImageData(url);
          }
        };
        xhr.send();
        // document.getElementById('link').setAttribute('content', response.url)
      })
      .then(() => {setIsLoading(false)})
      .catch(error => console.log(error));
    }
      
      

  
  

  return (
    <div className='container' >
      <SkeletonTheme baseColor="#595959" highlightColor="#bfbfbf" >
      <div className="picture">
        {isLoading?
        <Skeleton height={720} width={450} />:
        <>
        <img src={imageData}  alt="randomImage" id="image-preview" onClick={image}/></>}
      </div>
      <div className="share">
        <FacebookShareButton url={imageData} >
          <FacebookIcon size={48} round={false} />
        </FacebookShareButton>
        <TwitterShareButton url={imageData} >
          <TwitterIcon size={48} round={false} />
        </TwitterShareButton>
        <WhatsappShareButton url={imageData} >
          <WhatsappIcon size={48}  round={false} />
        </WhatsappShareButton>
      </div>
      </SkeletonTheme>
      <div>
    </div>
    </div>
  )
}

