import React, { useState, useEffect, useRef } from ‘react’;
import { Play, Pause, RotateCcw, Droplet, Zap, AlertTriangle, TrendingDown, TrendingUp } from ‘lucide-react’;

const SilicaAluminumComparison = () => {
const canvasLeftRef = useRef(null);
const canvasRightRef = useRef(null);
const [isRunning, setIsRunning] = useState(false);
const [time, setTime] = useState(0);
const [selectedMaterial, setSelectedMaterial] = useState(‘both’); // ‘aluminum’, ‘silica’, ‘both’

// Atmospheric state for both materials
const [aluminumState, setAluminumState] = useState({
particleDensity: 50,
conductivityMultiplier: 1.2,
emAmplification: 1.15,
ozoneConcentration: 280,
settlingRate: 0, // No natural settling
recyclingEfficiency: 0, // No recycling
costPerYear: 0
});

const [silicaState, setSilicaState] = useState({
particleDensity: 50,
conductivityMultiplier: 1.02, // Much lower EM effect
emAmplification: 1.02,
ozoneConcentration: 280,
settlingRate: 0.8, // Natural settling occurs
recyclingEfficiency: 0.6, // Returns to natural dust cycle
costPerYear: 0
});

const [particles, setParticles] = useState({
aluminum: [],
silica: [],
solarWind: []
});

// Initialize particles
useEffect(() => {
const initAluminum = Array.from({ length: 60 }, () => ({
x: Math.random() * 380,
y: 150 + Math.random() * 200,
vx: (Math.random() - 0.5) * 0.3,
vy: (Math.random() - 0.5) * 0.2,
charge: Math.random() * 2 - 1,
size: 2 + Math.random() * 2,
age: Math.random() * 500,
settling: false
}));

```
const initSilica = Array.from({ length: 60 }, () => ({
  x: Math.random() * 380,
  y: 150 + Math.random() * 200,
  vx: (Math.random() - 0.5) * 0.3,
  vy: (Math.random() - 0.5) * 0.2 + 0.05, // Slight downward bias
  charge: Math.random() * 0.4 - 0.2, // Much less charged
  size: 2 + Math.random() * 2,
  age: Math.random() * 500,
  settling: Math.random() < 0.3
}));

setParticles({
  aluminum: initAluminum,
  silica: initSilica,
  solarWind: []
});
```

}, []);

// Calculate aluminum effects
const calculateAluminumEffects = (particles, currentOzone) => {
const density = particles.length / 100;

```
// Electromagnetic coupling
const conductivity = 1.0 + (density * 0.5);
const emAmplification = 1.0 + Math.pow(density, 1.3) * 1.5;

// Catalytic ozone destruction
const catalyticRate = density * 0.02;
const emEnhancement = (emAmplification - 1) * 0.3;
const totalOzoneDestruction = catalyticRate + emEnhancement;

const newOzone = Math.max(150, currentOzone - totalOzoneDestruction);

// Economic costs (power law with EM amplification)
const ozoneDeficit = Math.max(0, 280 - newOzone);
const baseCost = 0.5 * Math.pow(ozoneDeficit, 2.0) / 10;
const emCost = (emAmplification - 1) * 15; // GPS/electronics/grid costs
const totalCost = (baseCost + emCost) * emAmplification;

return {
  conductivity,
  emAmplification,
  newOzone,
  costPerYear: totalCost
};
```

};

// Calculate silica effects
const calculateSilicaEffects = (particles, currentOzone) => {
const density = particles.filter(p => !p.settling).length / 100;

```
// Much lower EM coupling (silica is less conductive)
const conductivity = 1.0 + (density * 0.05);
const emAmplification = 1.0 + Math.pow(density, 1.1) * 0.2;

// Minimal ozone effects (no catalytic pathway)
const minorOzoneEffect = density * 0.002; // Light scattering only
const newOzone = Math.max(270, currentOzone - minorOzoneEffect);

// Economic costs (much lower)
const ozoneDeficit = Math.max(0, 280 - newOzone);
const baseCost = 0.1 * Math.pow(ozoneDeficit, 1.5) / 10;
const emCost = (emAmplification - 1) * 2; // Minimal EM costs
const totalCost = baseCost + emCost;

return {
  conductivity,
  emAmplification,
  newOzone,
  costPerYear: totalCost,
  activeParticles: particles.filter(p => !p.settling).length
};
```

};

// Main simulation loop
useEffect(() => {
if (!isRunning) return;

```
const interval = setInterval(() => {
  setTime(t => t + 1);

  setParticles(prev => {
    // Generate solar wind
    const newSolarWind = [];
    if (Math.random() < 0.2) {
      newSolarWind.push({
        x: Math.random() * 760,
        y: 0,
        vy: 2 + Math.random(),
        energy: 0.5 + Math.random() * 0.5
      });
    }

    const updatedSolarWind = [...prev.solarWind, ...newSolarWind]
      .filter(sw => sw.y < 400)
      .map(sw => ({ ...sw, y: sw.y + sw.vy }));

    // Update aluminum particles (no settling, continuous accumulation)
    const updatedAluminum = prev.aluminum.map(p => {
      let newVx = p.vx;
      let newVy = p.vy;
      
      // Strong EM interactions
      prev.aluminum.forEach(other => {
        if (other !== p) {
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          
          if (dist < 40) {
            const force = (p.charge * other.charge) / (dist * dist) * 0.08;
            newVx += force * dx / dist;
            newVy += force * dy / dist;
          }
        }
      });
      
      // Solar wind coupling
      updatedSolarWind.forEach(sw => {
        const dx = sw.x - p.x;
        const dy = sw.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 30) {
          newVy += sw.energy * Math.abs(p.charge) * 0.02;
        }
      });
      
      let newX = p.x + newVx;
      let newY = p.y + newVy;
      
      if (newX < 0 || newX > 380) newVx *= -0.8;
      if (newY < 150) newVy *= -0.8;
      if (newY > 350) newVy *= -0.9;
      
      newX = Math.max(0, Math.min(380, newX));
      newY = Math.max(150, Math.min(350, newY));
      
      return {
        ...p,
        x: newX,
        y: newY,
        vx: newVx * 0.97,
        vy: newVy * 0.97,
        age: p.age + 1
      };
    });

    // Add new aluminum (continuous injection)
    if (Math.random() < 0.15) {
      updatedAluminum.push({
        x: Math.random() * 380,
        y: 150 + Math.random() * 50,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        charge: Math.random() * 2 - 1,
        size: 2 + Math.random() * 2,
        age: 0,
        settling: false
      });
    }

    // Update silica particles (natural settling, aggregation, recycling)
    const updatedSilica = prev.silica.map(p => {
      // Check if should start settling
      if (!p.settling && Math.random() < 0.01) {
        p.settling = true;
      }
      
      let newVx = p.vx;
      let newVy = p.vy + (p.settling ? 0.15 : 0.05); // Gravity + enhanced settling
      
      // Weaker EM interactions
      prev.silica.forEach(other => {
        if (other !== p && !p.settling && !other.settling) {
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          
          if (dist < 30) {
            const force = (p.charge * other.charge) / (dist * dist) * 0.02;
            newVx += force * dx / dist;
            newVy += force * dy / dist;
          }
        }
      });
      
      // Minimal solar wind coupling
      updatedSolarWind.forEach(sw => {
        const dx = sw.x - (p.x + 400);
        const dy = sw.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 30 && !p.settling) {
          newVy += sw.energy * Math.abs(p.charge) * 0.005;
        }
      });
      
      let newX = p.x + newVx;
      let newY = p.y + newVy;
      
      if (newX < 0 || newX > 380) newVx *= -0.8;
      if (newY < 150 && !p.settling) newVy *= -0.8;
      if (newY > 350) {
        // Particle settled out - recycle it
        return {
          x: Math.random() * 380,
          y: 150 + Math.random() * 50,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2 + 0.05,
          charge: Math.random() * 0.4 - 0.2,
          size: 2 + Math.random() * 2,
          age: 0,
          settling: false
        };
      }
      
      newX = Math.max(0, Math.min(380, newX));
      newY = Math.max(150, Math.min(350, newY));
      
      return {
        ...p,
        x: newX,
        y: newY,
        vx: newVx * 0.95,
        vy: newVy * 0.95,
        age: p.age + 1
      };
    }).filter(p => p.age < 1000); // Remove very old particles

    // Add new silica (continuous injection at same rate)
    if (Math.random() < 0.15) {
      updatedSilica.push({
        x: Math.random() * 380,
        y: 150 + Math.random() * 50,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2 + 0.05,
        charge: Math.random() * 0.4 - 0.2,
        size: 2 + Math.random() * 2,
        age: 0,
        settling: Math.random() < 0.2
      });
    }

    return {
      aluminum: updatedAluminum.slice(-80), // Cap to prevent unlimited growth
      silica: updatedSilica,
      solarWind: updatedSolarWind
    };
  });

  // Update atmospheric states
  const alEffects = calculateAluminumEffects(particles.aluminum, aluminumState.ozoneConcentration);
  setAluminumState(prev => ({
    particleDensity: particles.aluminum.length / 10,
    conductivityMultiplier: alEffects.conductivity,
    emAmplification: alEffects.emAmplification,
    ozoneConcentration: alEffects.newOzone,
    settlingRate: 0,
    recyclingEfficiency: 0,
    costPerYear: alEffects.costPerYear
  }));

  const siEffects = calculateSilicaEffects(particles.silica, silicaState.ozoneConcentration);
  setSilicaState(prev => ({
    particleDensity: siEffects.activeParticles / 10,
    conductivityMultiplier: siEffects.conductivity,
    emAmplification: siEffects.emAmplification,
    ozoneConcentration: siEffects.newOzone,
    settlingRate: 0.8,
    recyclingEfficiency: 0.6,
    costPerYear: siEffects.costPerYear
  }));

}, 50);

return () => clearInterval(interval);
```

}, [isRunning, particles, aluminumState.ozoneConcentration, silicaState.ozoneConcentration]);

// Canvas rendering for aluminum
useEffect(() => {
const canvas = canvasLeftRef.current;
if (!canvas) return;

```
const ctx = canvas.getContext('2d');

// Background
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
const ozoneHealth = aluminumState.ozoneConcentration / 280;
gradient.addColorStop(0, 'rgba(10, 10, 40, 1)');
gradient.addColorStop(0.4, `rgba(30, 30, ${80 * ozoneHealth}, 1)`);
gradient.addColorStop(1, `rgba(${150 * (1 - ozoneHealth)}, 40, 70, 1)`);
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 400, 400);

// Stratosphere line
ctx.strokeStyle = 'rgba(120, 120, 180, 0.3)';
ctx.lineWidth = 2;
ctx.setLineDash([5, 5]);
ctx.beginPath();
ctx.moveTo(0, 150);
ctx.lineTo(400, 150);
ctx.stroke();
ctx.setLineDash([]);

// EM field lines (strong for aluminum)
if (aluminumState.emAmplification > 1.3) {
  ctx.strokeStyle = `rgba(200, 100, 255, ${(aluminumState.emAmplification - 1) * 0.4})`;
  ctx.lineWidth = 2;
  for (let i = 0; i < particles.aluminum.length; i += 2) {
    const p1 = particles.aluminum[i];
    for (let j = i + 1; j < Math.min(i + 3, particles.aluminum.length); j++) {
      const p2 = particles.aluminum[j];
      const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
      if (dist < 50) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
}

// Solar wind
particles.solarWind.forEach(sw => {
  ctx.fillStyle = `rgba(255, 200, 100, ${sw.energy})`;
  ctx.beginPath();
  ctx.arc(sw.x, sw.y, 2, 0, Math.PI * 2);
  ctx.fill();
});

// Aluminum particles
particles.aluminum.forEach(p => {
  const chargeMag = Math.abs(p.charge);
  
  // Glow
  if (chargeMag > 0.7) {
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
    glow.addColorStop(0, `rgba(200, 200, 255, ${chargeMag * 0.4})`);
    glow.addColorStop(1, 'rgba(200, 200, 255, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.fillStyle = `rgba(220, ${200 - chargeMag * 50}, 240, 0.9)`;
  ctx.strokeStyle = `rgba(255, ${180 - chargeMag * 80}, 255, 0.9)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
});

// Label
ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
ctx.font = 'bold 14px sans-serif';
ctx.fillText('ALUMINUM (Al₂O₃)', 10, 30);
ctx.font = '11px sans-serif';
ctx.fillStyle = 'rgba(255, 200, 200, 0.8)';
ctx.fillText('No natural removal • Accumulates continuously', 10, 50);
```

}, [particles, aluminumState]);

// Canvas rendering for silica
useEffect(() => {
const canvas = canvasRightRef.current;
if (!canvas) return;

```
const ctx = canvas.getContext('2d');

// Background
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
const ozoneHealth = silicaState.ozoneConcentration / 280;
gradient.addColorStop(0, 'rgba(10, 10, 40, 1)');
gradient.addColorStop(0.4, `rgba(30, 30, ${80 * ozoneHealth}, 1)`);
gradient.addColorStop(1, `rgba(${100 * (1 - ozoneHealth)}, 50, 80, 1)`);
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 400, 400);

// Stratosphere line
ctx.strokeStyle = 'rgba(120, 180, 120, 0.3)';
ctx.lineWidth = 2;
ctx.setLineDash([5, 5]);
ctx.beginPath();
ctx.moveTo(0, 150);
ctx.lineTo(400, 150);
ctx.stroke();
ctx.setLineDash([]);

// Weak EM field lines (minimal for silica)
if (silicaState.emAmplification > 1.05) {
  ctx.strokeStyle = `rgba(150, 200, 150, ${(silicaState.emAmplification - 1) * 0.8})`;
  ctx.lineWidth = 1;
  const activeParticles = particles.silica.filter(p => !p.settling);
  for (let i = 0; i < activeParticles.length; i += 3) {
    const p1 = activeParticles[i];
    if (i + 1 < activeParticles.length) {
      const p2 = activeParticles[i + 1];
      const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
      if (dist < 40) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
}

// Solar wind
particles.solarWind.forEach(sw => {
  ctx.fillStyle = `rgba(255, 200, 100, ${sw.energy * 0.5})`;
  ctx.beginPath();
  ctx.arc(sw.x + 400, sw.y, 2, 0, Math.PI * 2);
  ctx.fill();
});

// Silica particles
particles.silica.forEach(p => {
  const chargeMag = Math.abs(p.charge);
  const alpha = p.settling ? 0.4 : 0.9;
  
  // Settling particles are dimmer
  ctx.fillStyle = p.settling 
    ? `rgba(150, 180, 150, ${alpha * 0.6})` 
    : `rgba(180, ${220 - chargeMag * 40}, 180, ${alpha})`;
  
  ctx.strokeStyle = p.settling
    ? `rgba(120, 150, 120, ${alpha * 0.7})`
    : `rgba(150, ${240 - chargeMag * 60}, 150, ${alpha})`;
  
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Downward arrow for settling particles
  if (p.settling) {
    ctx.strokeStyle = `rgba(100, 150, 100, ${alpha * 0.8})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y + p.size + 2);
    ctx.lineTo(p.x, p.y + p.size + 8);
    ctx.moveTo(p.x - 2, p.y + p.size + 6);
    ctx.lineTo(p.x, p.y + p.size + 8);
    ctx.lineTo(p.x + 2, p.y + p.size + 6);
    ctx.stroke();
  }
});

// Label
ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
ctx.font = 'bold 14px sans-serif';
ctx.fillText('SILICA (SiO₂)', 10, 30);
ctx.font = '11px sans-serif';
ctx.fillStyle = 'rgba(200, 255, 200, 0.8)';
ctx.fillText('Natural settling • Returns to dust cycle', 10, 50);
```

}, [particles, silicaState]);

const reset = () => {
window.location.reload();
};

return (
<div className="w-full max-w-7xl mx-auto p-6 bg-slate-900 rounded-lg shadow-2xl">
<div className="mb-6">
<h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
<Droplet size={32} className="text-blue-400" />
Material Comparison: Aluminum vs. Silica
</h1>
<p className="text-slate-300 text-sm">
Comparing electromagnetic coupling and atmospheric effects
</p>
</div>

```
  {/* Side-by-side visualization */}
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="bg-slate-800 rounded-lg p-4">
      <canvas 
        ref={canvasLeftRef} 
        width={400} 
        height={400}
        className="w-full rounded border-2 border-red-900/50"
      />
    </div>
    <div className="bg-slate-800 rounded-lg p-4">
      <canvas 
        ref={canvasRightRef} 
        width={400} 
        height={400}
        className="w-full rounded border-2 border-green-900/50"
      />
    </div>
  </div>

  {/* Controls */}
  <div className="flex justify-center gap-4 mb-6">
    <button
      onClick={() => setIsRunning(!isRunning)}
      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
    >
      {isRunning ? <Pause size={20} /> : <Play size={20} />}
      {isRunning ? 'Pause' : 'Start'}
    </button>
    <button
      onClick={reset}
      className="flex items-center gap-2 px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
    >
      <RotateCcw size={20} />
      Reset
    </button>
  </div>

  {/* Comparison Metrics */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    {/* Aluminum metrics */}
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
        <AlertTriangle size={18} />
        Aluminum Oxide Effects
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-300">
          <span>Particle Density:</span>
          <span className="text-red-400 font-semibold">
            {aluminumState.particleDensity.toFixed(1)} units
          </span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>EM Amplification:</span>
          <span className={aluminumState.emAmplification > 1.5 ? 'text-red-400 font-bold' : 'text-orange-400'}>
            {aluminumState.emAmplification.toFixed(2)}×
          </span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Conductivity:</span>
          <span className="text-purple-400">
            {aluminumState.conductivityMultiplier.toFixed(2)}×
          </span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Ozone Layer:</span>
          <span className={aluminumState.ozoneConcentration < 250 ? 'text-red-400 font-bold' : 'text-yellow-400'}>
            {aluminumState.ozoneConcentration.toFixed(1)} DU
          </span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Natural Settling:</span>
          <span className="text-red-400 font-semibold">
            {(aluminumState.settlingRate * 100).toFixed(0)}% (NONE)
          </span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Recycling:</span>
          <span className="text-red-400 font-semibold">
            {(aluminumState.recyclingEfficiency * 100).toFixed(0)}% (NONE)
          </span>
        </div>
        <div className="border-t border-red-500/30 pt-2 mt-2">
          <div className="flex justify-between text-white font-bold">
            <span>Annual Cost:</span>
            <span className="text-red-400">${aluminumState.costPerYear.toFixed(1)}B</span>
          </div>
        </div>
      </div>
    </div>

    {/* Silica metrics */}
    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
        <TrendingDown size={18} />
        Silica Dioxide Effects
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-300">
          <span>Particle Density:</span>
          <span className="text-green-400 font-semibold">
            {silicaState.particleDensity.toFixed(1)} units
          </span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>EM Amplification:</span>
          <span className="text-green-400">
            {silicaState.emAmplification.toFixed(2)}×
          </span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Conductivity:</span>
          <span className="text-cyan-400">
            {silicaState.conductivityMultiplier.toFixed(2)}×
          </span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Ozone Layer:</span>
          <span className="text-green-400">
            {silicaState.ozoneConcentration.toFixed(1)} DU
          </span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Natural Settling:</span>
          <span className="text-green-400 font-semibold">
            {(silicaState.settlingRate * 100).toFixed(0)}% ✓
          </span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Recycling:</span>
          <span className="text-green-400 font-semibold">
            {(silicaState.recyclingEfficiency * 100).toFixed(0)}% ✓
          </span>
        </div>
        <div className="border-t border-green-500/30 pt-2 mt-2">
          <div className="flex justify-between text-white font-bold">
            <span>Annual Cost:</span>
            <span className="text-green-400">${silicaState.costPerYear.toFixed(1)}B</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Comparison Summary */}
  <div className="bg-slate-800 rounded-lg p-4 mb-6">
    <h3 className="text-lg font-semibold text-white mb-3">Direct Comparison</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div className="bg-slate-700 rounded p-3">
        <div className="text-slate-400 mb-2">EM Coupling Difference:</div>
        <div className="text-2xl font-bold text-purple-400">
          {((aluminumState.emAmplification / silicaState.emAmplification) - 1).toFixed(1)}×
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Aluminum amplifies {((aluminumState.emAmplification / silicaState.emAmplification)).toFixed(1)}× more than silica
        </div>
      </div>
      
      <div className="bg-slate-700 rounded p-3">
        <div className="text-slate-400 mb-2">Ozone Impact Ratio:</div>
        <div className="text-2xl font-bold text-yellow-400">
          {((280 - aluminumState.ozoneConcentration) / Math.max(0.1, 280 - silicaState.ozoneConcentration)).toFixed(1)}×
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Aluminum depletes ozone {((280 - aluminumState.ozoneConcentration) / Math.max(0.1, 280 - silicaState.ozoneConcentration)).toFixed(0)}× faster
        </div>
      </div>
      
      <div className="bg-slate-700 rounded p-3">
        <div className="text-slate-400 mb-2">Cost Ratio:</div>
        <div className="text-2xl font-bold text-red-400">
          {(aluminumState.costPerYear / Math.max(0.1, silicaState.costPerYear)).toFixed(1)}×
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Aluminum costs {(aluminumState.costPerYear / Math.max(0.1, silicaState.costPerYear)).toFixed(0)}× more annually
        </div>
      </div>
    </div>
  </div>

  {/* Key Findings */}
  <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300">
    <h4 className="font-semibold text-white mb-3">Key Findings:</h4>
    <div className="space-y-2">
      <p>
        <span className="text-red-400 font-semibold">Aluminum Oxide (Al₂O₃):</span> High conductivity creates strong electromagnetic coupling with solar wind. Particles accumulate indefinitely with no natural removal process. Acts as catalyst for ozone destruction. EM amplification {aluminumState.emAmplification.toFixed(2)}× leads to GPS disruption, electronic interference, and power grid stress.
      </p>
      <p>
        <span className="text-green-400 font-semibold">Silica Dioxide (SiO₂):</span> Much lower conductivity results in minimal EM coupling ({silicaState.emAmplification.toFixed(2)}×). Particles naturally aggregate and settle out of stratosphere. Returns to natural dust cycle. No catalytic ozone destruction pathways. Electromagnetic effects {((aluminumState.emAmplification / silicaState.emAmplification) - 1).toFixed(1)}× lower than aluminum.
      </p>
      <p>
        <span className="text-purple-400 font-semibold">Natural vs. Artificial:</span> Silica is Earth's most abundant mineral - natural dust cycles already handle volcanic silica emissions. Aluminum nanoparticles are artificial introduction with no natural removal mechanism. The atmosphere has evolved to process silica; it has no pathway for metallic aluminum nanoparticles.
      </p>
      <p>
        <span className="text-yellow-400 font-semibold">Cost-Benefit:</span> At equal injection rates, aluminum costs {(aluminumState.costPerYear / Math.max(0.1, silicaState.costPerYear)).toFixed(0)}× more due to EM coupling effects and ozone depletion. Silica's natural recycling means it doesn't accumulate to catastrophic thresholds. The economic externality difference is ${(aluminumState.costPerYear - silicaState.costPerYear).toFixed(1)}B annually.
      </p>
      <p>
        <span className="text-cyan-400 font-semibold">Resource Depletion:</span> Aluminum requires massive energy to produce from bauxite ore. Burning it in atmosphere permanently removes refined material from Earth's resource base. Silica is effectively inexhaustible and recycling doesn't deplete resources.
      </p>
    </div>
    <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500/30 rounded">
      <p className="text-blue-300 font-semibold mb-2">
        💡 Alternative Approach:
      </p>
      <p className="text-slate-300 text-xs">
        If atmospheric interventions are needed, silica-based approaches work WITH natural systems instead of against them. Combine with electromagnetic energy harvesting to create closed-loop systems. Use precision targeting (your triangulation idea) to enhance natural cloud formation rather than introducing artificial pollutants. The key: biomimetic engineering that copies nature's proven methods instead of imposing novel chemistry on atmospheric systems.
      </p>
    </div>
    <p className="mt-3 text-slate-400 text-xs">
      Time: {time} | Al Particles: {particles.aluminum.length} | Si Particles: {particles.silica.filter(p => !p.settling).length} active / {particles.silica.length} total
    </p>
  </div>
</div>
```

);
};

export default SilicaAluminumComparison;
