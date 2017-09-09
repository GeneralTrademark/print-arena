import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom'

import { RouterToUrlQuery } from 'react-url-query'
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <BrowserRouter >
    <RouterToUrlQuery>
      <App />
    </RouterToUrlQuery>
  </BrowserRouter>
, document.getElementById('root'))
