import React, { Component } from 'react';
import config from '../static/config'
import ImageLayout from './ImageLayout'
import TextLayout from './TextLayout'
import LinkLayout from './LinkLayout'
import {configureUrlQuery, addUrlProps, replaceUrlQuery, UrlQueryParamTypes } from 'react-url-query'
import './App.css';

import icon from '../static/arenamark.svg';

const urlPropsQueryConfig = {
  URICurrentChannel: { type: UrlQueryParamTypes.string, queryParam: 'ch' },
}

configureUrlQuery({
  addRouterParams: false,
})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      channel: !this.props.URICurrentChannel ? 'arena-influences' : this.props.URICurrentChannel,
      url: 'https://www.are.na/charles-broskoski/arena-influences',
      channelName: '',
      chConnections: [],
      channelInfo: {},
      images: [],
      deleted: [],
      book: false,
      loaded: false,
      betaOpen: true,
      pageCount: 3,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.URICurrentChannel !== this.props.URICurrentChannel) {
      this.setState({
        channel: nextProps.URICurrentChannel,
      })
    }
  }

  componentDidMount = () => {
    this.getArenaChannel(this.state.channel)
    replaceUrlQuery({'ch': this.state.channel })
  }

  getArenaChannel = (channel) => {
    const getChConnections = fetch(`${config.apiBase}/channels/${channel}/connections`)
    getChConnections.then(resp => resp.json()).then(response => {
      this.setState({chConnections: response})
    })
    const getChDetails = fetch(`${config.apiBase}/channels/${channel}`)
    getChDetails.then(resp => resp.json()).then(response => {
      this.setState({channelName: response.title, user: response.user.full_name, channelInfo: response, url: 'https://www.are.na/' + response.user.slug + '/' +response.slug})
    })
    const getItems = fetch(`${config.apiBase}/channels/${channel}/contents`)
    getItems.then(resp => resp.json()).then(response => {

      let items = response.contents.filter(function(item){
        return item.class === 'Image' || item.class === 'Text' || item.class === 'Link'
      })

      let itemUrls = items.map((item) => {
        if(item.class === 'Image'){
          return item = {url: item.image.original.url, title: item.title, id: item.id, type: item.class}
        } else if (item.class === 'Text') {
          return item = {content: item.content, title: item.title, id: item.id, type: item.class}
        } else if (item.class === 'Link') {
          return item = {url: item.source.url, image: item.image.original.url, title: item.title, id: item.id, type: item.class}
        } else {
          return undefined
        }
      })
      this.setState({images: itemUrls, loaded: true, pageCount: itemUrls.length+this.state.pageCount});
    })
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.value !== this.state.url) {
      let strUrl = this.state.value;
      let path = strUrl.replace(/^https?:\/\//, '').split('/');
      this.setState({channel: path[2], loaded: false, url: strUrl});
      this.getArenaChannel(path[2]);
      replaceUrlQuery({'ch': path[2]})
    }
  }

  handleMakePDF = () => {
    window.print();
  }

  toggleBeta = () => {
    this.setState({
      betaOpen: !this.state.betaOpen,
    })
  }

  removeItem = (item) => {
    this.setState({ deleted: this.state.deleted.concat([item.id]), pageCount: this.state.pageCount-- });
  }

  render() {
    let pageHeight = 0
    const calcHeight = (height) => {
      pageHeight = pageHeight + height
    }

    const makeConnection = (ch,i) => {
      return(
        <li key={i}>{ch.title}</li>
      )
    }

    const makeExtraPages = () => {
      // console.log(this.state.pageCount)
      // console.log(this.state.pageCount % 6)
      return(
        <div></div>
      )
    }

    const createItem = (item, i) => {
      let itemState = ''
      this.state.deleted.indexOf(item.id) === -1 ? itemState = '' : itemState = 'removed'
      let pageCount = this.state.pageCount

      if(item.type === 'Image'){
        return (
          <section key={item.id} className={`sheet ${itemState}`} >
            <div onClick={(e) => this.removeItem(item)} title="Remove this page" className='deletePage'>✕</div>
            <div className='image'>
              <ImageLayout calcHeight={calcHeight} url={item.url} id={item.id} title={item.title}/>
            </div>
            <div className='counter'></div>
          </section>
        )
      } else if (item.type === 'Text') {
        return (
          <section key={item.id} className='sheet' >
            <div onClick={(e) => this.removeItem(item)} title="Remove this page" className='deletePage'>✕</div>
            <TextLayout className='text' content={item.content} id={item.id} title={item.title}/>
            <div className='counter'></div>
          </section>
        )
      } else if (item.type === 'Link') {
        return (
          <section key={item.id} className='sheet' >
            <div onClick={(e) => this.removeItem(item)} title="Remove this page" className='deletePage'>✕</div>
            <LinkLayout className='text' id={item.id} title={item.title} url={item.url} image={item.image} />
            <div className='counter'></div>
          </section>
        )
      }
    }

    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateString = new Date().toLocaleString(undefined, options);
    let timeString = new Date().toLocaleTimeString();

    return (
      <div className="">
        <header className='header'>
          <form onSubmit={this.handleSubmit}>
            <label>
              <span className='formTitle'>are.na channel url:</span>
              <input
                className='formBox'
                type="text"
                placeholder={this.state.url}
                value={this.state.value}
                onChange={this.handleChange} />
            </label>
            <input className='formButton' type="submit" value="Submit" />
          </form>
          <button className='printButton' onClick={this.handleMakePDF}>Print</button>
        </header>
        {this.state.loaded ?
          <section className='wrap'>
            <section className='sheet firstSheet'>
              <div>
                <ul>
                  How this works:
                  <li>Paste an are.na ↝ channel to generate a formatted document.</li>
                  <li>Download PDF and upload through Blurb's <a href="http://www.blurb.com/pdf_uploader_frontend/index.html">pdf to book tool.</a> </li>
                  <li>The supported format is blurb's trade book size (5x8in).</li>
                </ul>
                <br />
                <ul>
                  Things in progress:
                  <li>Fixing a bunch of bugs concerning long text</li>
                  <li>Magazine, Tabloid, letter, A-sizes, and other blurb book sizes.</li>
                  <li>Guide to printing</li>
                  <li>Inline image and text editing</li>
                  <li>Something else? message us <a href="https://twitter.com/general_bot">@general_bot</a></li>
                </ul>

                <p>This tool should be used for archiving, developing references for new projects and generating experimental books.</p>
                <p>I made this because I wanted to print out images to put up in studio but creating boards from scratch was really annoying.</p>
                <p>To see what else has been made check out our <a href="https://www.are.na/callil-capuozzo/print-arena">are.na channel</a>.</p>
                <br />
                <p>This page will not be printed</p>
              </div>
            </section>
            <section className='sheet' >
              <div className='titlePage'>
                <span className='arena'>Are.na <span className='slash'> / </span> </span> {this.state.user}<span className='slash'> / </span><br></br><span className='channelTitle'>{this.state.channelName}</span>
              </div>
              <img alt='' className='mark' src={icon}/>
            </section>
            <section className='sheet' >
              <div className='infoPage'>
                <p>This book was generated from <span className='descUrl'>{this.state.url}</span> on {dateString} at {timeString}.</p>
                <ul>
                  <li><span className='el'>Followers:</span>{this.state.channelInfo.follower_count}</li>
                  <li><span className='el'>Items:</span>{this.state.channelInfo.length}</li>
                  <li><span className='el'>Id:</span>{this.state.channelInfo.id}</li>
                  <li><span className='el'>Status:</span>{this.state.channelInfo.status}</li>
                  <li><span className='el'>Slug:</span>{this.state.channelInfo.slug}</li>
                  <li><span className='el'>Created:</span>{this.state.channelInfo.created_at}</li>
                  <li><span className='el'>Updated:</span>{this.state.channelInfo.updated_at}</li>
                </ul>
                <ul className={this.state.chConnections.length > 16 ? 'connections' : ''}>
                  <p style={{width: '100%'}} className='el'>Connections:</p>
                  {this.state.chConnections.length > 0 ? this.state.chConnections.channels.map(makeConnection) : 'No connections'}
                </ul>
              </div>
            </section>
            {this.state.images.map(createItem)}
            {makeExtraPages()}
            <section className='sheet' >
              <div className='indexPage'>
                <img alt='' className='lastMark' src={icon}/>
                <ul className='colophon'>
                  <li><span className='el'>print are.na v0.2</span></li>
                  <li><span className='el'>built by <a href="gtm.nyc">general trademark</a></span></li>
                  <li><span className='el'>thanks to http://are.na</span></li>
                </ul>
              </div>
            </section>
          </section>
          : <div className='loader'><p>Loading Book...</p></div>
        }
      </div>
    );
  }
}

export default addUrlProps({ urlPropsQueryConfig })(App);
