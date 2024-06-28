import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import SearchAndPaste from './components/Search';

const App: Component = () => {
  return (
    <div>
        <h1>Image Paste App</h1>
        <SearchAndPaste/>
    </div>
  );
};

export default App;
