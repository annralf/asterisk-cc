'use client'

import { Provider } from 'react-redux';

import { store } from './store';





interface PropsProvider {
  children: React.ReactNode
}

const Providers = ({children}:PropsProvider) =>(
  <Provider store={store}>
    {children}
  </Provider>
)

export default Providers