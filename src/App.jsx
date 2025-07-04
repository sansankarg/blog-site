import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MarkdownPage from './pages/MarkdownPage';
import { Buffer } from 'buffer';
window.Buffer = Buffer;
import Announcement from './components/Anouncement';


function App() {
  
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch('/config.json')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setConfig(data);
      })
      .catch((error) => {
        console.error('Error fetching JSON:', error);
      });
  }, []);
  

  if (!config) return <p>Loading...</p>;

  return (
    <div>
      <Announcement/>
      <Navbar title={config.site.title} />

      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<MarkdownPage />} />
        </Routes>
      </div>
    </div>
  );
}

const styles = {
  content: {
    width: '90%',
    maxWidth: '800px',
    margin: '2rem auto',
  },
};

export default App;
