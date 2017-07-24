import React, { Component } from 'react';

class ImageLayout extends Component {
  constructor(props) {
      super(props);
      this.state = {dimensions: {}};
      this.onImgLoad = this.onImgLoad.bind(this);
  }
  onImgLoad({target:img}) {
      this.setState({
        dimensions:{
          height: img.offsetHeight,
          width: img.offsetWidth}
        });
      this.props.calcHeight(img.offsetHeight)
  }
  render(){
    const {width, height} = this.state.dimensions;

    return (
      <div className='image'>
        <img alt='' onLoad={this.onImgLoad} src={this.props.url}/>
        <div className='itemText'>
          <p className='imageTitle'>{this.props.title}</p>
          <a href="src" className='desc'>{this.props.url}</a>
        </div>
      </div>
      );
    }
}

export default ImageLayout
