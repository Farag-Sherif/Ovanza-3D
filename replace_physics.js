const fs = require('fs');
const path = './src/components/three/HeroScene.tsx';
let content = fs.readFileSync(path, 'utf8');

const startStr = '      if (orbsGroup.current) {';
const endStr = '      }';

const startIdx = content.indexOf(startStr);
if (startIdx !== -1) {
    const nextFnIdx = content.indexOf('});', startIdx);
    const blockEnd = content.indexOf('      }', nextFnIdx) + 7;
    
    const newBlock = \      if (orbsGroup.current) {
        const t = state.clock.elapsedTime;
        
        // Step 1: Calculate target positions
        const targets = orbs.map((o) => {
          const angle = t * o.speed + o.phase;
          const flatX = Math.cos(angle) * o.rx;
          const flatZ = Math.sin(angle) * o.rz;
          const cosT = Math.cos(o.tiltX);
          const sinT = Math.sin(o.tiltX);
          const tiltedY = flatZ * sinT + o.yBase;
          const tiltedZ = flatZ * cosT;
          const bob = Math.sin(t * o.bobFreq + o.phase * 2) * o.bobAmp;
          return new THREE.Vector3(flatX, tiltedY + bob, tiltedZ);
        });

        // Step 2: Push overlapping targets apart (repulsion)
        const MIN_DISTANCE = 1.35; // Safe distance given the new sizes
        for (let i = 0; i < targets.length; i++) {
          for (let j = i + 1; j < targets.length; j++) {
            const p1 = targets[i];
            const p2 = targets[j];
            const dist = p1.distanceTo(p2);
            if (dist < MIN_DISTANCE) {
              const push = (MIN_DISTANCE - dist) * 0.5;
              const dir = new THREE.Vector3().subVectors(p1, p2).normalize();
              if (dir.lengthSq() === 0) dir.set(1, 0, 0); // fallback if perfectly overlapping
              p1.addScaledVector(dir, push);
              p2.addScaledVector(dir, -push);
            }
          }
        }

        // Step 3: Apply smoothed positions and rotations
        orbsGroup.current.children.forEach((child, i) => {
          const o = orbs[i];
          if (!o || !targets[i]) return;

          // Smooth lerp to the (potentially repulsed) target
          child.position.lerp(targets[i], 0.04);
  
          // Slow elegant self-rotation
          child.rotation.y = t * o.spinSpeed + o.phase;
          child.rotation.x = Math.sin(t * 0.25 + o.phase) * 0.1 + 0.12;
          child.rotation.z = Math.cos(t * 0.2 + o.phase) * 0.05;
        });
      }\;

    content = content.substring(0, startIdx) + newBlock + content.substring(blockEnd);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully applied repulsion logic.');
} else {
    console.log('Could not find orbsGroup.current block.');
}
