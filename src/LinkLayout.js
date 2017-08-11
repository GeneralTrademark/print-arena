import React, { Component } from 'react';
import cheerio from 'cheerio';
import axios from 'axios';

class LinkLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      body: ''
    };

    this.setBody = this.setBody.bind(this);
  }

  componentDidMount = () => {
    axios.get(`https://cors-anywhere.herokuapp.com/${this.props.url}`).then( (response) => {
      let $ = cheerio.load(response.data);
      let html = $('p').eq(3);
      return(html);
    })
    .then ((html) => {
      this.setBody(html);
    });
  }

  setBody (html) {
    this.setState({
      body: html.text()
    });
  }

  render(){
    return (
      <div className='text'>
        <h2>{this.props.title}</h2>
        <p>{this.state.body}</p>
      </div>
    );
  }
}

export default LinkLayout
