import { useEffect, useState } from 'react';
import './IntelligentSuggestion.css'

const IntelligentSuggestion = () => {
  const SERVER = 'http://localhost:8123';
  const [suggestions, setSuggestions] = useState([]);
  const [baseImage, setBaseImage] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const formData = new FormData();
    formData.append('image', baseImage, baseImage.name);

    try {
      setLoading(true);
      const uploadResponse = await fetch(`${SERVER}/suggestion/getSuggestion`, {
        method: 'POST',
        body: formData
      });

      if (uploadResponse.ok) {
        const { fileName } = await uploadResponse.json();
        const response = await fetch(`${SERVER}/suggestion/getSuggestion?fileName=${fileName}`);
        const data = await response.json();
        setSuggestions(data.outfitCombinations);
        if (response.ok) {
          setLoading(false);
          setBaseImage('');
        }
      } else {
        console.warn('Failed to upload image');
      }
    } catch (err) {
      console.warn(err);
    }
  }


  const handleBaseImageChange = async (e) => {
    setBaseImage(e.target.files[0]);
    setUploadedImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    if (suggestions.length !== 0) {
      setIsDataLoaded(true);
    }
  }, [suggestions])

  return (
    <div className='IntelligentSuggestion'>
      <div className='buttons-container'>
        <input type='button' onClick={handleClick} value='Obtine Sugestii' />
        <div>
          <label htmlFor="file-upload" className="custom-file-upload">Incarca Imagine</label>
          <input id="file-upload" type="file" onChange={handleBaseImageChange} />
        </div>
        {uploadedImageUrl !== '' && <img src={uploadedImageUrl} alt='' />}
      </div>
      <div className='suggestions-container'>
        {isDataLoaded ?
          <>
            {suggestions.map((o, index) => (
              <div key={index}>
                {o[0] && <a href={`/products/${o[0]._id}`}><img src={`${SERVER}/images/products/${o[0]._id}/img1.jpg`} alt='' /></a>}
                {o[1] && <a href={`/products/${o[1]._id}`}><img src={`${SERVER}/images/products/${o[1]._id}/img1.jpg`} alt='' /></a>}
                {o[2] && <a href={`/products/${o[2]._id}`}><img src={`${SERVER}/images/products/${o[2]._id}/img1.jpg`} alt='' /></a>}
              </div>
            ))}
          </>
          :
          <>
            {loading ?
              <>
                <div className='empty-suggestions'>
                  <h2>Se incarca...</h2>
                </div>
              </>
              :
              <div className='empty-suggestions'>
                <h2>Nicio Recomandare Incarcata</h2>
              </div>
            }
          </>
        }
      </div>
    </div>
  )
}

export default IntelligentSuggestion