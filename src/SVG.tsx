import CustomSvg from './CustomSvg';
import testSVG from './alt-battery-3-svgrepo-com.svg'

function SVG() {
    return (
        <> 
            <br />
            <img 
                src={testSVG} 
                alt=""
                style={{ width: "200px", color: 'red', filter: 'invert' }}
            />
            <br />
            <CustomSvg fill="pink" />
        </>
    )
}

export default SVG;