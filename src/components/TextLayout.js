import React, { Component } from 'react';
import ContentEditable from 'react-simple-contenteditable';

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
       text: value
     })
   }

  render(){
    return (
      <div className='text'>
        <ContentEditable
          html={this.props.content}
          className="my-class"
          onChange={ this.handleChange }
          contentEditable="plaintext-only"
        />
      </div>
      );
    }
}

export default TextLayout
