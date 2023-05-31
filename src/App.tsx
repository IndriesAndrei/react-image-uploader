import React from 'react';
import { useEffect, useState } from 'react'
import './App.css'
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import { AiFillFileImage } from 'react-icons/ai';
// import SVG from './SVG';

function App() {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const objectRef = React.useRef<HTMLObjectElement | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [image, setImage] = useState<string>('');
  const [fileName, setFileName] = useState("No selected file");
  const [JsonFile, setJsonFile] = useState<FileList | null>(null);
  const [svg, setSVG] = React.useState<SVGSVGElement | null>();
  const svgJSON = JSON.stringify(svg?.outerHTML);
  const animations = svg?.getAnimations({subtree:true})

  useEffect(() => {
    const svgImage = document.querySelector('.svg-image');
    if (svg) {
      console.log('Image', svgImage) 
      window['aaa'] = animations;
      console.log('Animations', animations, JSON.parse(JSON.stringify(animations)))
    }
  }, [svg])

  const downloadFile = () => {
    // create file in browser
    const fileName = "svg-download-file";
    const json = JSON.stringify(document.querySelector('.svg-textarea')?.innerHTML);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileReader = new FileReader();
      e.target.files instanceof FileList ? fileReader.readAsText(e.target.files[0], "UTF-8") : '';
      fileReader.onload = function(){
        console.log("e.target.result", e.target.files);
        setJsonFile(e.target.files);
      }
  }

   return (
    <>
      <h1>SVG Demo</h1>
      <br />
      <form className='form-area' onClick={() => inputRef.current?.click()}>
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
              width={200}
              height={200}
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
            <p>Browse SVG to upload</p>
          </>
        }
      </form>
      {image && (
        <>
          <textarea
            value={svgJSON || 'empty'}
            rows={15}
            cols={50}
            onChange={() => {console.log('onchange was triggered');}}
            className='svg-textarea'
            ref={textareaRef}
          />
          <br />
          <button 
            className='download-button'
            onClick={downloadFile}
          >
            Download
          </button>
        </>
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
      <section className='form-area'>
        <h3>Upload a JSON file</h3>
        <input type="file" onChange={handleFileUpload} />
      </section>
    </>
  )
}

export default App
