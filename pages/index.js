import React, { Component } from 'react';
import config from './config'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      channel: 'moodring',
      images: [],
      loaded: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    this.getArenaChannel();
  }

  getArenaChannel = () => {
    const getImages = fetch(`${config.apiBase}/channels/${this.state.channel}/contents`)
    getImages.then(resp => resp.json()).then(response => {
      let images = response.contents.filter(function(item){
        return item.class == 'Image'
      })
      let imageUrls = images.map((item) => {
        return item = {url: item.image.original.url, title: item.image.title, id: item.id}
      })
      this.setState({images: imageUrls, loaded: true});
    })
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let strUrl = this.state.value;
    console.log(strUrl)
    let path = strUrl.replace(/^https?:\/\//, '').split('/');
    console.log(path[2])
    this.setState({channel: path[2], loaded: false});
    this.getArenaChannel();
  }

  render() {
    const createItem = function(image) {
      return (
        <div key={image.id} className='imageItem'>
          <img src={image.url}/>
          <style jsx>{`
             .imageItem{
               flex: 0 0 auto;
               width: 21.0vw;
               height: 29.7vw;
               padding: 1rem;
               margin: 1rem;
               -webkit-box-shadow: 0px 9px 61px 0px rgba(0,0,0,0.14);
              -moz-box-shadow: 0px 9px 61px 0px rgba(0,0,0,0.14);
              box-shadow: 0px 9px 61px 0px rgba(0,0,0,0.14);
               border: 1px solid lightgrey;
              }
              img{
                max-width: 100%;
                max-height: 100%;
              }
             }
           `}</style>
        </div>
      );
    };

    return (
      <div>
        <div className='header'>
          <form onSubmit={this.handleSubmit}>
            <label>
              <span className='formTitle'>enter are.na channel url:</span>
              <input
                type="text"
                placeholder='https://www.are.na/callil-capuozzo/moodring'
                value={this.state.value}
                onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className='body'>
          {this.state.loaded ? this.state.images.map(createItem) : <p>Still Loading...</p>}
        </div>
        <style jsx>{`
            .header{
              width: 100%;
            }
            .formTitle{
             color: green;
             padding-right: 10px;
           }
           .body{
             height: 90vh;
             padding-top: 5vh;
             display: flex;
             flex-wrap: nowrap;
             overflow-x: auto;
             -webkit-overflow-scrolling: touch;
             -ms-overflow-style: -ms-autohiding-scrollbar; }
           }
           input{
             max-width: 70vw;
           }
         `}</style>
       </div>
    );
  }
}

export default App
