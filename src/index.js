import React from 'react';
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

class ImageComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
      imageId: null,
      shareURL: null,
      result: null,
      isLoading: true
    };
  }


  componentDidMount() {
    this.updateImage();
  }

  updateImage = () => {
    this.setState({isLoading: true});
    fetch('https://picsum.photos/720/450')
      .then((response) => {
        this.setState({ imageUrl: response.url });
        this.extractIdFromLink(response.url)
      })
      .then(() => {this.setState({isLoading: false})})
      .catch((error) => {
        console.error('update image Error'+error);
      });
  }

  extractIdFromLink(prop) {

    if(prop!==null) {
      let url = prop;
      let id = url.split('/')[4];

      this.setState({imageId: id});
      this.fetchImageUrl(id);
    }
    else {
      console.log('prop----waiting......');
      setTimeout(this.extractIdFromLink, 300);
    }
  }



  fetchImageUrl(id) {
    const url = `https://picsum.photos/id/${id}/info`;

    const check = () => {
      if(url!==null){
        fetch(url)
        .then(response => response.text())
        .then(result => {this.setState({result: result})})
        .then(() => {this.fetchShareUrl();})
        .catch(error => {
          console.error('Fetch Iamage Error Error:', error);
        });
      }
      else{
        setTimeout(check, 300);
      }
    }
    check();
  }

  fetchShareUrl() {
    const check = () => {
      let result = this.state.result;
      result = this.state.result;

      if(result!==null){
        var jsonObject = JSON.parse(result);
        var url = jsonObject.url;
        this.setState({shareURL: url});
      }
      else {
        console.log('result----waiting......');
        setTimeout(check, 300);
      }
    }
    check();
  }


  render() {
    
    return (
      <div className='container' >
        <SkeletonTheme baseColor="#595959" highlightColor="#bfbfbf" >
          <div className="picture">

            {this.state.isLoading ? <Skeleton /> :
            <img src={this.state.imageUrl} alt="randomImage" id="image-preview" onClick={this.updateImage} />}
          </div>
          <div className="share">
            <FacebookShareButton url={this.state.shareURL} >
              <FacebookIcon size={48} round={false} />
            </FacebookShareButton>
            <TwitterShareButton url={this.state.shareURL} >
              <TwitterIcon size={48} round={false} />
            </TwitterShareButton>
            <WhatsappShareButton url={this.state.shareURL} >
              <WhatsappIcon size={48} round={false} />
            </WhatsappShareButton>
          </div>
        </SkeletonTheme>
      </div>
    )
  }

}

function App() {
  return (
    <ImageComponent />
  );
}