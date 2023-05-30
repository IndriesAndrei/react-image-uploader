import { useEffect, useState } from 'react'
import './App.css'
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import { AiFillFileImage } from 'react-icons/ai';
import React from 'react';
// import SVG from './SVG';

function App() {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const objectRef = React.useRef<HTMLObjectElement | null>(null);
  const [image, setImage] = useState<string>('');
  const [fileName, setFileName] = useState("No selected file");
  const [svg, setSVG] = React.useState<SVGSVGElement | null>();
  const svgJSON = JSON.stringify(svg?.outerHTML);

  useEffect(() => {
    const svgImage = document.querySelector('.svg-image');
    if (svg) {
      console.log('Image', svgImage) 
      const animations = svg.getAnimations({subtree:true})
      window['aaa'] = animations;
      console.log('Animations', animations, JSON.parse(JSON.stringify(animations)))
    }
  }, [svg])

   return (
    <>
      <h1>SVG Demo</h1>
      <br />
      <form onClick={() => inputRef.current?.click()}>
        <input 
          ref={inputRef}
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
            <object
              ref={objectRef}
              data={image}
              width={150}
              height={150}
              name={fileName}
              className='svg-image'
              id='svgId'
              onLoad={() => {
                const svg = objectRef.current?.contentDocument?.querySelector('svg');
                setSVG(svg);
              }}
            />
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
      {image && (
        <textarea
          value={svgJSON || 'empty'}
          rows={15}
          cols={50}
          onChange={() => {console.log('onchange was triggered');}}
          className='svg-textarea'
        />
      )}
      <section className='uploaded-row'>
        <AiFillFileImage color='#1475cf' />
        <span className='upload-content'>
          {fileName}
          <MdDelete 
            onClick={() =>{
              setFileName("No Selected File")
              setImage('')
            }}
          />
        </span>
      </section>
      {/* <SVG /> */}
    </>
  )
}

export default App
