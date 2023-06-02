import React from 'react';
import { useEffect, useState } from 'react'
import './App.css'
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import { AiFillFileImage } from 'react-icons/ai';
import { xml2js } from 'xml-js';
// import SVG from './SVG';

function App() {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const objectRef = React.useRef<HTMLObjectElement | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [image, setImage] = useState<string>('');
  const [fileName, setFileName] = useState("No selected file");
  const [JsonFile, setJsonFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  const [svg, setSVG] = React.useState<SVGSVGElement | null>();
  const [svgAnimations, setSvgAnimations] = useState<any[]>([]);
  const svgJSON = JSON.stringify(svg?.outerHTML);
  const animations = svg?.getAnimations({subtree:true});
  const animationsParsed = JSON.parse(JSON.stringify(animations));

  const MAX_PREVIEW_LENGTH = 200;

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // if (JsonFile) {
        const file = e.target.files?.[0];
        setJsonFile(file || null);
      // }
  }

  const handleUpload = () => {
    if (JsonFile) {
      const reader = new FileReader();
     
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const fileContent = reader.result as string;
          const jsonData = JSON.parse(fileContent);
         
          setJsonData(jsonData);
          
          // Extract animations from the SVG
          const svgAnimations: any[] = [];
          traverse(jsonData, svgAnimations);

          setSvgAnimations(svgAnimations);
        }
      };

      reader.readAsText(JsonFile);
    }
  }

  const traverse = (element: any, svgAnimations: any[]) => {
    if (Array.isArray(element)) {
      element.forEach((child) => traverse(child, svgAnimations));
    } else if (typeof element === 'object' && element !== null) {
      if (element.name === 'animate' || element.name === 'animateTransform') {
        svgAnimations.push(element);
      }
  
      if (element.elements) {
        traverse(element.elements, svgAnimations);
      }
    }
  };

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
            value={animationsParsed || 'empty'}
            rows={15}
            cols={50}
            onChange={() => {console.log('onchange was triggered');}}
            className='svg-textarea'
            ref={textareaRef}
          />
          {/* <pre>{JSON.stringify(svgAnimations, null, 2)}</pre> */}
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
      <section className='form-area'>
        <h3>Upload a JSON file</h3>
        <input 
          type="file" 
          onChange={handleFileChange} 
        />
        <button 
          className='upload-button'
          onClick={handleUpload}
        >Upload</button>
        {jsonData && (
          <>
            <h3>Preview of the JSON file</h3>
            <div style={{ paddingBottom: '10px' }}>{JSON.stringify(jsonData, null, 2).substring(0, MAX_PREVIEW_LENGTH)}...</div>
            
          </>
        )}
      </section>
    </>
  )
}

export default App
