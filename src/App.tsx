import { useRef, useState } from 'react'
import './App.css'
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import { AiFillFileImage } from 'react-icons/ai';

function App() {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No selected file")

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
          <img src={image} width={150} height={150} alt={fileName} />
          :
          <>
            <MdCloudUpload color="#md1475cf" size={60} />
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
