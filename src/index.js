import React, { useEffect } from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  TelegramIcon
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

  useEffect(() => {image()}, []);

  function image() {
    setIsLoading(true)
    fetch('https://picsum.photos/450/720')
      .then(response => {
        console.log(response.url);
        setRandomImage(response.url);
      })
      .then(() => {setIsLoading(false)})
      .catch(error => console.log(error));
    }

  function download() {
    fetch(randomImage)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        return file;
      });
    }

    const shareImage = async (file) => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My Image',
            text: 'Check out this image!',
            files: [file],
          });
        } catch (error) {
          console.error('Error sharing image:', error.message);
        }
      } else {
        console.error('Sharing not supported');
      }
    };

  return (
    <div className='container' >
      <div className="picture">
        {isLoading? <rect className='skeletone'/>:<img src={randomImage} alt="randomImage" onClick={image} />}
      </div>
      <div className="share">
        <FacebookShareButton url={randomImage} >
          <FacebookIcon size={48} round={false} />
        </FacebookShareButton>
        <TwitterShareButton url={randomImage} >
          <TwitterIcon size={48} round={false} />
        </TwitterShareButton>
        <WhatsappShareButton url={randomImage} >
          <WhatsappIcon size={48}  round={false} />
        </WhatsappShareButton>
        <TelegramIcon size={48} round={false} onClick={() => shareImage(download())} />
      </div>
    </div>
  )
}


