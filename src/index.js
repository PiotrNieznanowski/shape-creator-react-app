// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './state/index'


import './index.css';
import "antd/dist/antd.css";
import './App.css';


import { library } from '@fortawesome/fontawesome-svg-core'

import {
  faCheckSquare,
  faCoffee,
  faImage,
  faAtom,
  faClone,
  faTrash,
  faUndoAlt,
  faRedoAlt,
  faPlay,
  faStop,
  faCircle,
  faDrawPolygon,
  faPencilRuler,
  faFileImport,
  faHeart,
  faBars,
  faPlus,
  faHome,
  faAngleDown,
  faCube,
  faFile,
  faShapes,
  faCode,
  faCheck,
  faArrowLeft,
  faDiceD6
  


} from '@fortawesome/free-solid-svg-icons'

library.add(
  faCheckSquare,
  faCoffee,
  faImage,
  faAtom,
  faClone,
  faTrash,
  faUndoAlt,
  faRedoAlt,
  faPlay,
  faStop,
  faCircle,
  faDrawPolygon,
  faPencilRuler,
  faFileImport,
  faHeart,
  faBars,
  faPlus,
  faHome,
  faAngleDown,
  faCube,
  faFile,
  faShapes,
  faCode,
  faCheck,
  faArrowLeft,
  faDiceD6
  




)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider> , document.getElementById('root'));







