import React, { useState, useEffect, useRef } from ‘react’;
import { Play, Pause, RotateCcw, TrendingUp, AlertTriangle } from ‘lucide-react’;

const AtmosphericEconomicsSimulation = () => {
const canvasRef = useRef(null);
const [isRunning, setIsRunning] = useState(false);
const [time, setTime] = useState(0);
const [economicImpact, setEconomicImpact] = useState({
ozoneDamage: 0,
agriculturalLoss: 0,
healthCosts: 0,
climateDisruption: 0,
totalCost: 0
});

// Agent state
const [agents, setAgents] = useState({
aluminum: [],
sulfur: [],
photons: []
});

const [atmosphericState, setAtmosphericState] = useState({
ozoneConcentration: 100,
temperature: 15,
emFieldStrength: 0,
refractiveIndex: 1.0,
polarizationDistortion: 0
});

// Initialize agents
useEffect(() => {
const initialAluminum = Array.from({ length: 50 }, () => ({
x: Math.random() * 800,
y: Math.random() * 400,
vx: (Math.random() - 0.5) * 0.5,
vy: (Math.random() - 0.5) * 0.5,
charge: Math.random() * 2 - 1,
mass: 1.0,
temp: 15 + Math.random() * 5
}));

```
const initialSulfur = Array.from({ length: 60 }, () => ({
  x: Math.random() * 800,
  y: Math.random() * 400,
  vx: (Math.random() - 0.5) * 0.3,
  vy: (Math.random() - 0.5) * 0.3,
  charge: Math.random() * 1.5 - 0.75,
  mass: 0.8,
  temp: 15 + Math.random() * 5
}));

const initialPhotons = Array.from({ length: 40 }, () => ({
  x: Math.random() * 800,
  y: 0,
  vx: (Math.random() - 0.5) * 0.2,
  vy: 2 + Math.random() * 1,
  wavelength: 400 + Math.random() * 300,
  polarization: Math.random() * Math.PI * 2,
  intensity: 1.0
}));

setAgents({
  aluminum: initialAluminum,
  sulfur: initialSulfur,
  photons: initialPhotons
});
```

}, []);

// Simulation update loop
useEffect(() => {
if (!isRunning) return;

```
const interval = setInterval(() => {
  setTime(t => t + 1);
  
  setAgents(prev => {
    const newAluminum = prev.aluminum.map(al => {
      let fx = 0, fy = 0;
      let heatGain = 0;

      // Electromagnetic interactions with sulfur
      prev.sulfur.forEach(s => {
        const dx = s.x - al.x;
        const dy = s.y - al.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1;
        
        // Coulomb force
        const force = (al.charge * s.charge) / (dist * dist) * 0.1;
        fx += force * dx / dist;
        fy += force * dy / dist;

        // Thermal interaction
        if (dist < 30) {
          heatGain += (s.temp - al.temp) * 0.01;
        }
      });

      // Photon interactions - light scattering and heating
      prev.photons.forEach(p => {
        const dx = p.x - al.x;
        const dy = p.y - al.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 15) {
          // Absorption heating (especially UV)
          if (p.wavelength < 450) {
            heatGain += p.intensity * 0.05;
          }
        }
      });

      const newTemp = al.temp + heatGain;
      const newVx = al.vx + fx * 0.1;
      const newVy = al.vy + fy * 0.1;
      
      let newX = al.x + newVx;
      let newY = al.y + newVy;

      // Boundary conditions
      if (newX < 0 || newX > 800) newVx *= -0.8;
      if (newY < 0 || newY > 400) newVy *= -0.8;
      newX = Math.max(0, Math.min(800, newX));
      newY = Math.max(0, Math.min(400, newY));

      return {
        ...al,
        x: newX,
        y: newY,
        vx: newVx * 0.99,
        vy: newVy * 0.99,
        temp: newTemp
      };
    });

    const newSulfur = prev.sulfur.map(s => {
      let fx = 0, fy = 0;
      let heatGain = 0;

      // Electromagnetic interactions with aluminum
      prev.aluminum.forEach(al => {
        const dx = al.x - s.x;
        const dy = al.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1;
        
        const force = (s.charge * al.charge) / (dist * dist) * 0.1;
        fx += force * dx / dist;
        fy += force * dy / dist;

        if (dist < 30) {
          heatGain += (al.temp - s.temp) * 0.01;
        }
      });

      const newTemp = s.temp + heatGain;
      const newVx = s.vx + fx * 0.1;
      const newVy = s.vy + fy * 0.1;
      
      let newX = s.x + newVx;
      let newY = s.y + newVy;

      if (newX < 0 || newX > 800) newVx *= -0.8;
      if (newY < 0 || newY > 400) newVy *= -0.8;
      newX = Math.max(0, Math.min(800, newX));
      newY = Math.max(0, Math.min(400, newY));

      return {
        ...s,
        x: newX,
        y: newY,
        vx: newVx * 0.99,
        vy: newVy * 0.99,
        temp: newTemp
      };
    });

    const newPhotons = prev.photons.map(p => {
      let newPolarization = p.polarization;
      let newIntensity = p.intensity;
      let scatterX = 0, scatterY = 0;

      // Light scattering from aluminum particles
      prev.aluminum.forEach(al => {
        const dx = al.x - p.x;
        const dy = al.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 20) {
          // Rayleigh scattering effect
          const scatterProb = 1 / (p.wavelength * p.wavelength) * 0.001;
          scatterX += (Math.random() - 0.5) * scatterProb * 5;
          scatterY += (Math.random() - 0.5) * scatterProb * 5;
          
          // Polarization change
          newPolarization += (Math.random() - 0.5) * 0.1;
          
          // Intensity reduction
          newIntensity *= 0.98;
        }
      });

      // Interaction with sulfur dioxide
      prev.sulfur.forEach(s => {
        const dx = s.x - p.x;
        const dy = s.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 15) {
          // SO2 absorption (especially UV)
          if (p.wavelength < 350) {
            newIntensity *= 0.95;
          }
          scatterX += (Math.random() - 0.5) * 0.02;
          scatterY += (Math.random() - 0.5) * 0.02;
        }
      });

      let newX = p.x + p.vx + scatterX;
      let newY = p.y + p.vy + scatterY;

      // Reset photons that leave the canvas
      if (newY > 400) {
        newY = 0;
        newX = Math.random() * 800;
        newIntensity = 1.0;
        newPolarization = Math.random() * Math.PI * 2;
      }

      return {
        ...p,
        x: newX,
        y: newY,
        polarization: newPolarization,
        intensity: newIntensity
      };
    });

    return {
      aluminum: newAluminum,
      sulfur: newSulfur,
      photons: newPhotons
    };
  });

  // Update atmospheric state
  setAtmosphericState(prev => {
    const avgAlTemp = agents.aluminum.reduce((sum, al) => sum + al.temp, 0) / agents.aluminum.length || 15;
    const avgSulfurTemp = agents.sulfur.reduce((sum, s) => sum + s.temp, 0) / agents.sulfur.length || 15;
    const avgTemp = (avgAlTemp + avgSulfurTemp) / 2;

    const totalCharge = [...agents.aluminum, ...agents.sulfur].reduce((sum, a) => sum + Math.abs(a.charge), 0);
    const emField = totalCharge / 100;

    const avgPolarizationChange = agents.photons.reduce((sum, p) => sum + Math.abs(p.polarization % (Math.PI * 2) - Math.PI), 0) / agents.photons.length || 0;
    
    const avgIntensity = agents.photons.reduce((sum, p) => sum + p.intensity, 0) / agents.photons.length || 1;
    const refractiveChange = 1.0 + (1 - avgIntensity) * 0.1;

    // Ozone depletion from both aluminum and sulfur
    const aluminumDamage = agents.aluminum.length * 0.002;
    const sulfurDamage = agents.sulfur.length * 0.003;
    const ozoneDepletion = prev.ozoneConcentration - (aluminumDamage + sulfurDamage);

    return {
      ozoneConcentration: Math.max(50, ozoneDepletion),
      temperature: avgTemp,
      emFieldStrength: emField,
      refractiveIndex: refractiveChange,
      polarizationDistortion: avgPolarizationChange
    };
  });

  // Calculate economic impacts
  setEconomicImpact(prev => {
    const ozoneDepletion = 100 - atmosphericState.ozoneConcentration;
    const tempAnomaly = Math.abs(atmosphericState.temperature - 15);
    const emDisruption = atmosphericState.emFieldStrength;
    const opticalDisruption = Math.abs(atmosphericState.refractiveIndex - 1.0) + atmosphericState.polarizationDistortion;

    // Economic damage calculations (billions USD per year)
    const ozoneDamage = ozoneDepletion * 2.5; // UV damage, skin cancer, ecosystem disruption
    const agriculturalLoss = (ozoneDepletion * 1.8 + tempAnomaly * 3.2 + opticalDisruption * 50); // Crop failures
    const healthCosts = (ozoneDepletion * 3.1 + tempAnomaly * 2.5); // Healthcare burden
    const climateDisruption = (tempAnomaly * 4.5 + emDisruption * 15 + opticalDisruption * 80); // Cascading effects

    const totalCost = ozoneDamage + agriculturalLoss + healthCosts + climateDisruption;

    return {
      ozoneDamage,
      agriculturalLoss,
      healthCosts,
      climateDisruption,
      totalCost
    };
  });

}, 50);

return () => clearInterval(interval);
```

}, [isRunning, agents, atmosphericState]);

// Canvas rendering
useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;

```
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#0a0a1a';
ctx.fillRect(0, 0, 800, 400);

// Draw photons (light rays)
agents.photons.forEach(p => {
  const hue = ((p.wavelength - 400) / 300) * 280;
  ctx.fillStyle = `hsla(${hue}, 100%, ${50 * p.intensity}%, ${p.intensity * 0.6})`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
  ctx.fill();
});

// Draw aluminum particles
agents.aluminum.forEach(al => {
  const heat = Math.min((al.temp - 15) / 10, 1);
  ctx.fillStyle = `rgba(180, 180, 200, 0.8)`;
  ctx.strokeStyle = `rgba(255, ${255 * (1 - heat)}, 100, 0.6)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(al.x, al.y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
});

// Draw sulfur dioxide
agents.sulfur.forEach(s => {
  const heat = Math.min((s.temp - 15) / 10, 1);
  ctx.fillStyle = `rgba(230, 230, 100, 0.7)`;
  ctx.strokeStyle = `rgba(255, ${255 * (1 - heat)}, 0, 0.5)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(s.x, s.y, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
});
```

}, [agents]);

const reset = () => {
setTime(0);
setIsRunning(false);
window.location.reload();
};

return (
<div className="w-full max-w-6xl mx-auto p-6 bg-slate-900 rounded-lg shadow-2xl">
<div className="mb-6">
<h1 className="text-3xl font-bold text-white mb-2">
Atmospheric Chemistry Economics Simulation
</h1>
<p className="text-slate-300 text-sm">
Agent-based model of aluminum oxide and SO₂ interactions with electromagnetic, thermodynamic, and optical coupling effects
</p>
</div>

```
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    <div className="lg:col-span-2">
      <div className="bg-slate-800 rounded-lg p-4">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400}
          className="w-full rounded border border-slate-700"
        />
        <div className="flex justify-center gap-4 mt-4">
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
        <div className="mt-4 flex justify-around text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-400 rounded-full border border-orange-400"></div>
            <span className="text-slate-300">Aluminum Oxide</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full border border-orange-400"></div>
            <span className="text-slate-300">Sulfur Dioxide</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded-full opacity-60"></div>
            <span className="text-slate-300">Photons</span>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-400" />
          Atmospheric State
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Ozone</span>
              <span className={atmosphericState.ozoneConcentration < 80 ? 'text-red-400' : 'text-green-400'}>
                {atmosphericState.ozoneConcentration.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${atmosphericState.ozoneConcentration < 80 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${atmosphericState.ozoneConcentration}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Temperature</span>
              <span className={Math.abs(atmosphericState.temperature - 15) > 2 ? 'text-orange-400' : 'text-blue-400'}>
                {atmosphericState.temperature.toFixed(1)}°C
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>EM Field</span>
              <span className="text-purple-400">{atmosphericState.emFieldStrength.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Refractive Index</span>
              <span className="text-cyan-400">{atmosphericState.refractiveIndex.toFixed(4)}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Polarization Δ</span>
              <span className="text-pink-400">{atmosphericState.polarizationDistortion.toFixed(3)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
          <AlertTriangle size={20} />
          Economic Impact
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Ozone Damage:</span>
            <span className="text-red-400 font-semibold">${economicImpact.ozoneDamage.toFixed(1)}B/yr</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Agricultural Loss:</span>
            <span className="text-orange-400 font-semibold">${economicImpact.agriculturalLoss.toFixed(1)}B/yr</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Health Costs:</span>
            <span className="text-yellow-400 font-semibold">${economicImpact.healthCosts.toFixed(1)}B/yr</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Climate Disruption:</span>
            <span className="text-purple-400 font-semibold">${economicImpact.climateDisruption.toFixed(1)}B/yr</span>
          </div>
          <div className="border-t border-red-500/30 pt-2 mt-2">
            <div className="flex justify-between text-white font-bold text-base">
              <span>Total Annual Cost:</span>
              <span className="text-red-400">${economicImpact.totalCost.toFixed(1)}B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300">
    <h4 className="font-semibold text-white mb-2">Model Dynamics:</h4>
    <p className="mb-2">
      This agent-based model simulates emergent electromagnetic, thermodynamic, and optical interactions between aluminum oxide particles (from satellite reentry), sulfur dioxide (from geoengineering), and photons in the atmosphere.
    </p>
    <ul className="list-disc list-inside space-y-1 ml-2">
      <li>Electromagnetic coupling between charged particles creates unexpected field dynamics</li>
      <li>Thermal energy transfer leads to temperature anomalies and atmospheric instability</li>
      <li>Light scattering and polarization changes affect solar radiation and climate</li>
      <li>Ozone depletion from both compounds has cascading economic effects</li>
      <li>Economic impacts scale nonlinearly with atmospheric degradation</li>
    </ul>
    <p className="mt-3 text-yellow-400 font-semibold">
      Time Step: {time} | The true cost of atmospheric modification becomes clear through emergent system behaviors.
    </p>
  </div>
</div>
```

);
};

export default AtmosphericEconomicsSimulation;
