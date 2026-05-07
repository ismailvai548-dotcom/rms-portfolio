import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Admin from './Admin.jsx' 
import './index.css'

// পাথ চেক করার আরও একটি নিরাপদ উপায়
const currentPath = window.location.pathname.toLowerCase();

const RootComponent = () => {
  // যদি পাথে 'admin' লেখা থাকে তবে Admin পেজ দেখাবে
  if (currentPath.includes('/admin')) {
    return <Admin />;
  }
  // অন্য সব ক্ষেত্রে মেইন App পেজ দেখাবে
  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>,
)