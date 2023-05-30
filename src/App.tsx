import { useEffect, useState } from 'react'
import './App.css'
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import { AiFillFileImage } from 'react-icons/ai';
// import SVG from './SVG';

function App() {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No selected file")
  const [string, setString] = useState('')
  const svg = document.getElementById('svgId');

  const handleChange = () => {
    // Gets the svg as a string
    const svgText = svg ? svg.innerHTML : '';
  
    // Create the JSON string
    const jsonString = JSON.stringify(svgText);
    setString(jsonString)
  }

  useEffect(() => {
    const svgImage = document.querySelector('.svg-image');
    if (svgImage) {
      console.log('Image', svgImage)
      const animations = document.getAnimations()
      console.log('Animations', animations)
    }
  }, [image])

  return (
    <>
      <h1>SVG Demo</h1>
      <br />
      <form onClick={() => document.querySelector(".input-field").click()}>
        <input 
          type="file" 
          name="file" 
          accept='image/svg+xml' //allow only svg files, to allow all image files change to 'image/*'
          className='input-field' 
          hidden
          onChange={({ target: {files}}) => {
            if(files) {
              files[0] && setFileName(files[0].name)
              setImage(URL.createObjectURL(files[0]))
            }
          }}
        />
       
        {image ? 
          <>
            <object data={image} width={150} height={150} name={fileName} className='svg-image' id='svgId' />
            <textarea value={string} rows={4} cols={50} onChange={handleChange}>{string}</textarea>
          </>
          :
          <>
            <p>
              <MdCloudUpload color="#md1475cf" size={60} />
            </p>
            <p>Browse Files to upload</p>
          </>
        }
      </form>
      <section className='uploaded-row'>
        <AiFillFileImage color='#1475cf' />
        <span className='upload-content'>
          {fileName}
          <MdDelete 
            onClick={() =>{
              setFileName("No Selected File")
              setImage(null)
            }}
          />
        </span>
      </section>
      {/* <SVG /> */}
    </>
  )
}

export default App
