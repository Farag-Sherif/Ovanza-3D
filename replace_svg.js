const fs = require('fs');

const path = './src/pages/Home.tsx';
let content = fs.readFileSync(path, 'utf8');

const mapSvg = fs.readFileSync('./egypt.svg', 'utf8');
const mapPathMatch = mapSvg.match(/<path d="([^"]+)"/);
const mapPath = mapPathMatch ? mapPathMatch[1] : '';

const svgReplacement = \
              <svg viewBox="0 0 1024 1024" className="h-full w-full drop-shadow-[0_0_25px_rgba(212,169,92,0.2)]">
                <g transform="translate(0, 1024) scale(0.1, -0.1)">
                  <path d="\" fill="#d4a95c" fillOpacity="0.1" stroke="#d4a95c" strokeWidth="15" strokeLinejoin="round" />
                </g>
                
                {/* Distribution nodes over the map */}
                {[
                  [650, 350], [550, 250], [700, 700], [750, 850], [800, 500], [400, 450], [600, 500]
                ].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="10" fill="#d4a95c" fillOpacity="0.9" />
                    <circle cx={x} cy={y} r="25" fill="none" stroke="#d4a95c" strokeOpacity="0.5" strokeWidth="3">
                      <animate attributeName="r" values="10;35" dur="2s" repeatCount="indefinite" begin={\\s\} />
                      <animate attributeName="stroke-opacity" values="0.8;0" dur="2s" repeatCount="indefinite" begin={\\s\} />
                    </circle>
                  </g>
                ))}
              </svg>
\;

const startIdx = content.indexOf('<svg viewBox="0 0 400 400"');
const endIdx = content.indexOf('</svg>', startIdx) + 6;

if (startIdx > -1 && endIdx > -1) {
  content = content.substring(0, startIdx) + svgReplacement.trim() + content.substring(endIdx);
  fs.writeFileSync(path, content);
  console.log('Successfully replaced SVG.');
} else {
  console.log('Could not find SVG to replace.');
}
