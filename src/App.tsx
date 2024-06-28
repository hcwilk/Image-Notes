import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import SearchAndPaste from './components/Search';

const App: Component = () => {
  return (
    <div class='flex flex-col items-center w-full mt-8'>
        <h1 class='font-semibold text-4xl mx-24'>Image Paste App</h1>
        <SearchAndPaste/>
    </div>
  );
};

export default App;
