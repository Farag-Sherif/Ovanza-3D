import fs from 'fs';
import path from 'path';

const srcBase = 'C:/Users/Andalus/.gemini/antigravity/brain/6625dce4-1cbe-4c1b-bc77-a3ba2b41c416/scratch/uploaded_models';
const dstBase = 'd:/Blue Brain/ovanzalast-main/ovanza-frontend/ovanza-frontend/public/assets';

const copyList = [
  // Wax Red
  ['wax/Hair WAX premium metal print new-0١.png', 'wax-red/top.png'],
  ['wax/new star premium shea butter-0١.png', 'wax-red/lid-side.png'],
  ['wax/new star premium shea butter-0٢.png', 'wax-red/body.png'],
  ['wax/Hair WAX premium metal print new-0٢.png', 'wax-red/bottom.png'],

  // Wax Black
  ['wax/new star premium shea butter-١٨.png', 'wax-black/top.png'],
  ['wax/new star premium shea butter-١٦.png', 'wax-black/lid-side.png'],
  ['wax/new star premium shea butter-١٩.png', 'wax-black/body.png'],
  ['wax/new star premium shea butter-١٧.png', 'wax-black/bottom.png'],

  // Jar Cream
  ['source/ضياء-0٥.jpg.jpeg', 'jar-cream/top-blue.jpg'],
  ['source/ضياء-0٤.jpg.jpeg', 'jar-cream/side-blue.jpg'],
  ['source/ضيا-0١.jpg.jpeg', 'jar-cream/top-yellow.jpg'],
  ['source/ضيا-0٢.jpg.jpeg', 'jar-cream/side-yellow.jpg'],
  ['source/ضياء-0٧.jpg.jpeg', 'jar-cream/top-pink.jpg'],
  ['source/ضياء-0٦.jpg.jpeg', 'jar-cream/side-pink.jpg'],
  ['source/ضياء-0٨.jpg.jpeg', 'jar-cream/side-black.jpg'],
  ['source/ضياء-0٩.jpg.jpeg', 'jar-cream/top-black.jpg'],

  // Colonia
  ['colonia/cologne for print final ed-0١.png', 'colonia/label-01.png'],
  ['colonia/cologne for print final ed-0٢.png', 'colonia/label-02.png'],
  ['colonia/cologne for print final ed-0٣.png', 'colonia/label-03.png'],
  ['colonia/cologne for print final ed-0٤.png', 'colonia/label-04.png'],
  ['colonia/cologne for print final ed-0٥.png', 'colonia/label-05.png'],
  ['colonia/cologne for print final ed-0٦.png', 'colonia/label-06.png'],

  // Shaving
  ['shaving/شيفينج جيل-0١-0١ (1).png', 'shaving/label-01.png'],
  ['shaving/شيفينج جيل-0١-0٢ (1).png', 'shaving/label-02.png'],
];

for (const [srcRel, dstRel] of copyList) {
  const src = path.join(srcBase, srcRel);
  const dst = path.join(dstBase, dstRel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  console.log('Copied ' + srcRel + ' -> ' + dstRel + ' (' + fs.statSync(dst).size + ' bytes)');
}
console.log('All files copied successfully.');
