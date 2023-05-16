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
    const file = e.target.files[0];
    if (file && file.type === 'image/jpeg') {
      setBaseImage(file);
      setUploadedImageUrl(URL.createObjectURL(file));
    } else {
      console.warn('Invalid file type. Please select a JPG file.');
    }
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
          <input id="file-upload" type="file" accept=".jpg" onChange={handleBaseImageChange} />
        </div>
        {uploadedImageUrl !== '' && <img src={uploadedImageUrl} alt='' />}
      </div>
      <div className='suggestions-container'>
        {isDataLoaded ?
          <>
            <div>
              {suggestions[0] && <a href={`/products/${suggestions[0]._id}`}><img src={`${SERVER}/images/products/${suggestions[0]._id}/img1.jpg`} alt='' /></a>}
              {suggestions[1] && <a href={`/products/${suggestions[1]._id}`}><img src={`${SERVER}/images/products/${suggestions[1]._id}/img1.jpg`} alt='' /></a>}
              {suggestions[2] && <a href={`/products/${suggestions[2]._id}`}><img src={`${SERVER}/images/products/${suggestions[2]._id}/img1.jpg`} alt='' /></a>}
            </div>
            <div>
              {suggestions[3] && <a href={`/products/${suggestions[3]._id}`}><img src={`${SERVER}/images/products/${suggestions[3]._id}/img1.jpg`} alt='' /></a>}
              {suggestions[4] && <a href={`/products/${suggestions[4]._id}`}><img src={`${SERVER}/images/products/${suggestions[4]._id}/img1.jpg`} alt='' /></a>}
              {suggestions[5] && <a href={`/products/${suggestions[5]._id}`}><img src={`${SERVER}/images/products/${suggestions[5]._id}/img1.jpg`} alt='' /></a>}
            </div>
            <div>
              {suggestions[6] && <a href={`/products/${suggestions[6]._id}`}><img src={`${SERVER}/images/products/${suggestions[6]._id}/img1.jpg`} alt='' /></a>}
              {suggestions[7] && <a href={`/products/${suggestions[7]._id}`}><img src={`${SERVER}/images/products/${suggestions[7]._id}/img1.jpg`} alt='' /></a>}
              {suggestions[8] && <a href={`/products/${suggestions[8]._id}`}><img src={`${SERVER}/images/products/${suggestions[8]._id}/img1.jpg`} alt='' /></a>}
            </div>
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