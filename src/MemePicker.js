import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './MemePicker.css';

function MemePicker({ updateSelectedMemeIndex }) {
  const [memes, setMemes] = useState([]);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const navigate = useNavigate();

  /**
   * Fetch the data of the meme images from imgflip.
   */
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        if (data.success) {
          setMemes(data.data.memes);
          // Set default meme if needed
          if (data.data.memes.length > 0) {
            setSelectedMeme(data.data.memes[0]);
          }
        } else {
          console.error('Failed to fetch memes:', data.error_message);
        }
      } catch (error) {
        console.error('Error fetching memes:', error);
      }
      
    };

    fetchMemes();
  }, []);

  /**
   * Handles how the meme is selected by the user clicking on the meme image they want.
   * Then that meme gets passed as the selected meme and gets taken back to the main page (app.js)
   * as that selected meme by passing the meme and it's id over.
   * @param {The selected meme that the user picked.} meme 
   */
  const handleMemeSelect = (meme) => {
    setSelectedMeme(meme);
    navigate(`/${meme.id}`);
  };

  /**
   * The HTML renders.
   */
  return (
    <div className="App">
      <h1>Choose A Meme Image</h1>
      <div className="memes-list">
        {memes.map((meme) => (
          <div
            key={meme.id}
            className={`meme-item ${selectedMeme && selectedMeme.id === meme.id ? 'selected' : ''}`}
            onClick={() => handleMemeSelect(meme)}
          >
            <img src={meme.url} alt={meme.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemePicker;
