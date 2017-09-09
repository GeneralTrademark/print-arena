import React, { Component } from 'react';
import cheerio from 'cheerio';
import axios from 'axios';

class LinkLayout extends Component {
  render(){
    return (
      <div className='image'>
        <img src={this.props.image} alt='' />
        <div className='itemText'>
          <p className='imageTitle'>{this.props.title}</p>
          <a href="src" className='desc'>{this.props.url}</a>
        </div>
        {/* <p>{this.state.body}</p> */}
      </div>
    );
  }
}

export default LinkLayout
