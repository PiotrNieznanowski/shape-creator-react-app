import application from './application/reducer'
import { createStore } from 'redux';

const store = createStore(application)
export default store



