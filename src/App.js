import React, { useState, useEffect  } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import MemePicker from './MemePicker'
import './App.css';

/**
 * The page of the main page.
 * @returns The main meme page for generating memes.
 */
function App() {
  // Meme images (The DNA of the soul.)
  const [memes, setMemes] = useState([]);
  const [selectedMemeIndex, setSelectedMemeIndex] = useState(0);
  const [generatedMemeUrl, setGeneratedMemeUrl] = useState(null);
  const [textFields, setTextFields] = useState({});
  const navigate = useNavigate();
  const { memeId } = useParams();
  

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
          const initialTextFields = {};
          
          data.data.memes.forEach((meme) => {
            initialTextFields[meme.id] = Array(meme.box_count).fill('');
          });


          setTextFields(initialTextFields);
        } 
        else {
          console.error('Fetch failure:', data.error_message);
        }
      } 
      catch (error) {
        console.error('ERROR:', error);
      }
    };

    fetchMemes();
  }, []);

  /**
   * This is how randomly generated memes gets shown and how we can choose our meme.
   */
  useEffect(() => {
    if (memeId) {
      const selectedMeme = memes.find((meme) => meme.id === memeId);
      if (selectedMeme) {
        setSelectedMemeIndex(memes.indexOf(selectedMeme));
      } 
      else {
        setSelectedMemeIndex(Math.floor(Math.random() * memes.length));
      }
    } 
    else {
      setSelectedMemeIndex(Math.floor(Math.random() * memes.length));
    }

  }, [memeId, memes, navigate]);
  
  /**
   * API Post call. 
   */
  const handleGenerateMeme = async () => {
    const selectedMeme = memes[selectedMemeIndex];
    const templateId = selectedMeme.id;
    const username = 'xtrghj234';
    const password = 'LkMneeUio67!';
    
    // Mapping this for proper formatting for the API.
    const textFieldsForMeme = textFields[selectedMeme.id].map((text, index) => `boxes[${index}][text]=${encodeURIComponent(text)}`).join('&');
    
    // Constructing the request body.
    const requestBody = `template_id=${templateId}&username=${username}&password=${password}&${textFieldsForMeme}`;
    
    // The call itself.
    try {
      const response = await fetch('https://api.imgflip.com/caption_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
      });
      const data = await response.json();
      if (data.success) {
        console.log('Success:', data.data.url);
        setGeneratedMemeUrl(data.data.url);
        alert("Your meme has been generated scroll down to check.");
      } 
      else {
        console.error('Failed:', data.error_message);
      }
    } 
    catch (error) {
      console.error('ERROR:', error);
    }
  };

  /**
   * Next button functionally. 
   */
  const handleNextClick = () => {
    setSelectedMemeIndex((prevIndex) => (prevIndex + 1) % memes.length);
  };

  /**
   * Previous button functionally.
   */
  const handlePrevClick = () => {
    setSelectedMemeIndex((prevIndex) => (prevIndex - 1 + memes.length) % memes.length);
  };

  /**
   * Handles how the text fields gets changed.
   * @param {Index of the text} index 
   * @param {Value of the text} value 
   */
  const handleTextFieldChange = (index, value) => {
    setTextFields((prevTextFields) => ({
      ...prevTextFields,
      [selectedMeme.id]: prevTextFields[selectedMeme.id].map((item, i) => (i === index ? value : item))
    }));
  };

  /**
   * Button functinally for navigating to the MemePicker page.
   */
  const handleMemePicker = () => {
    navigate('/meme-picker');
  }

  /**
   * The button functionally for generating a random meme because doing a refresh
   * no work :( nah this is much better I think.
   */
  const handleRandomMeme = () => {
    setSelectedMemeIndex(Math.floor(Math.random() * memes.length));
  }

  /**
   * Selected meme index.
   */
  const selectedMeme = memes[selectedMemeIndex];

  /**
   * The HTML renders. 
   */
  return (
    <div className="App">
      <h2>Easy Meme Creator</h2>
      <div className="text-overlay">
        {selectedMeme && textFields[selectedMeme.id] && textFields[selectedMeme.id].map((text, index) => (
          <input
            key={index}
            type="text"
            value={text}
            onChange={(e) => handleTextFieldChange(index, e.target.value)}
            required
          />
        ))}
      </div>
      <div className="buttons-container">
          <button onClick={handleGenerateMeme}>Generate Meme</button>
          <button onClick={handleMemePicker}>Choose your meme</button>
          <button onClick={handleRandomMeme}>Random Meme</button>
      </div>
      <div className="arrows-container">
        <button onClick={handlePrevClick}>←</button>
        <button onClick={handleNextClick}>→</button>
      </div>
      {selectedMeme && (
        <div className="selected-meme">
          <img src={selectedMeme.url} alt={selectedMeme.name} />
        </div>
      )}
      {generatedMemeUrl ? (
        <img src={generatedMemeUrl} alt="Generated Meme" />
      ) : (
        <p>Your meme will be generated here...</p>
      )}
    </div>
  );
  
}

/**
 * The routing of the paging for going to from one page to another.
 * @returns The routes for the pages.
 */
function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:memeId" element={<App />} />
        <Route path="/meme-picker" element={<MemePicker />} />
      </Routes>
    </Router>
  );
}

export default Routers;
