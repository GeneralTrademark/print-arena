import React, { Component } from 'react';
import ContentEditable from 'react-simple-contenteditable';
import ReactMarkdown from 'react-markdown'

import {ReactHeight} from 'react-height';

class TextLayout extends Component {
  constructor (props) {
    super(props);

    this.state = {
      text: this.props.content,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (ev, value) {
     this.setState({
       text: value,
       fontSize: 'medium',
     })
   }

  countLines(height) {
     var lineHeight = 1.3
     var lines = height / lineHeight;
     lines > 400 ? this.setState({fontSize: 'medium'}) : null
     lines > 600 ? this.setState({fontSize: 'small'}) : null
     lines > 800 ? this.setState({fontSize: 'mini'}) : null
   }

  render(){
    return (
      <div className='text' >
        <ReactHeight onHeightReady={height => this.countLines(height)}>
          <ReactMarkdown className={this.state.fontSize} source={this.props.content} />
          {/* <ContentEditable
            html={this.props.content}
            className="my-class"
            onChange={ this.handleChange }
            contentEditable="plaintext-only"
            style={{fontSize: this.state.fontSize}}
          /> */}
        </ReactHeight>
      </div>
      );
    }
}

export default TextLayout
