import React from 'react';
import { useEffect, useState } from 'react'
import './App.css'
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import { AiFillFileImage } from 'react-icons/ai';
import { parse } from 'svg-parser';

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

  const MAX_PREVIEW_LENGTH = 200;

  useEffect(() => {
    const svgImage = document.querySelector('.svg-image');
    if (svg) {
      console.log('Image', svgImage) 
      const animations = svg.getAnimations({ subtree: true });
      // const animationsParsed = JSON.parse(JSON.stringify(animations));
      window['aaa'] = animations;
      console.log('Animations', animations, JSON.parse(JSON.stringify(animations)))
      const animationsArray = Array.from(animations);
      setSvgAnimations(animationsArray);

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

  const parseSvg = (svgString: any) => {
    if (!svgString) {
      return null;
    }
  
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    return doc.querySelector('svg');
  };

  const handleUpload = () => {
    console.log('handleUpload called');
    if (JsonFile) {
      const reader = new FileReader();
     
      reader.onload = (e) => {
        console.log('reader.onload called');
        if (e.target && e.target.result) {
          // const fileContent = reader.result as string;
          const fileContent = e.target.result as string;
          // Parse SVG file using svg-parser
          const parsedSvg = parseSvg(fileContent);
          
          if (parsedSvg) {
            // Extract animations from the SVG
            const svgAnimations: any[] = [];
            console.log('Parsed SVG:', parsedSvg);
            traverse(parsedSvg, svgAnimations);
            console.log('SVG Animations:', svgAnimations);
      
            setSvgAnimations(svgAnimations);
          } else {
            console.log('Invalid SVG file');
          }
      
          // Parse JSON data
          const jsonContent = e.target.result as string;
          const parsedJsonData = JSON.parse(jsonContent);
          setJsonData(parsedJsonData);
        }
      };

      reader.readAsText(JsonFile);
    }
  }

  const traverse = (node: any, svgAnimations: any[]) => {
    if (node.type === 'element' && (node.tagName === 'animate' || node.tagName === 'animateTransform')) {
      svgAnimations.push(node);
    }
  
    if (node.children) {
      node.children.forEach((child: any) => traverse(child, svgAnimations));
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
                setTimeout(() => {
                  const svgImage = objectRef.current?.contentDocument?.querySelector('svg');
                  if (svgImage) {
                    setSVG(svgImage);
                    const parsedSvg = parse(svgImage.outerHTML);
                    const svgAnimations: any[] = [];
                    traverse(parsedSvg, svgAnimations);
                    setSvgAnimations(svgAnimations);
                  }
                }, 100)
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
            <div style={{ paddingBottom: '10px' }}>  
              {JSON.stringify(jsonData, null, 2).substring(0, MAX_PREVIEW_LENGTH)}
              {jsonData.length > MAX_PREVIEW_LENGTH && '...'}
            </div>
          </>
        )}
      </section>

      {svgAnimations.length > 0 && (
        <section>
          <h3>SVG Animations</h3>
          <ul>
            {svgAnimations.map((animation, index) => (
              <li key={index}>{JSON.stringify(animation)}</li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

export default App
