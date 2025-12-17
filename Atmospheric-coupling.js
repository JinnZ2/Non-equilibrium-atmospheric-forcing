import React, { useState, useEffect, useRef } from ‘react’;
import { Play, Pause, RotateCcw, TrendingDown, Zap, Thermometer, Eye } from ‘lucide-react’;

const AdvancedAtmosphericCouplingModel = () => {
const canvasRef = useRef(null);
const [isRunning, setIsRunning] = useState(false);
const [time, setTime] = useState(0);

// Enhanced atmospheric state with coupling coefficients
const [atmosphericState, setAtmosphericState] = useState({
ozoneConcentration: 280, // Dobson Units
temperature: 15,
aluminumDensity: 0,
sulfurDensity: 0,
emFieldStrength: 0,
couplingAmplification: 1.0,
cascadeRisk: 0,
powerLawExponent: 0
});

const [couplingMetrics, setCouplingMetrics] = useState({
electromagneticCoupling: 0,
thermodynamicCoupling: 0,
photochemicalCoupling: 0,
geometricResonance: 0,
nonlinearityIndex: 0
});

const [thresholdData, setThresholdData] = useState([]);

// Agent populations
const [agents, setAgents] = useState({
aluminum: [],
sulfur: [],
ozoneKillers: [] // New agent type for catalytic destruction
});

// Initialize agents with more sophisticated properties
useEffect(() => {
const initialAluminum = Array.from({ length: 40 }, () => ({
x: Math.random() * 800,
y: Math.random() * 400,
vx: (Math.random() - 0.5) * 0.3,
vy: (Math.random() - 0.5) * 0.3,
charge: Math.random() * 2 - 1,
mass: 1.0,
temp: 15 + Math.random() * 3,
resonanceFreq: 50 + Math.random() * 200, // MHz
couplingRadius: 15 + Math.random() * 10
}));

```
const initialSulfur = Array.from({ length: 50 }, () => ({
  x: Math.random() * 800,
  y: Math.random() * 400,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4,
  charge: Math.random() * 1.5 - 0.75,
  mass: 0.8,
  temp: 15 + Math.random() * 3,
  reactivity: Math.random(),
  ozoneDestructionRate: 0.02 + Math.random() * 0.03
}));

setAgents({
  aluminum: initialAluminum,
  sulfur: initialSulfur,
  ozoneKillers: []
});
```

}, []);

// Advanced coupling equations
const calculateCouplingEffects = (aluminum, sulfur, time) => {
let totalEmCoupling = 0;
let totalThermoCoupling = 0;
let totalPhotoCoupling = 0;
let geometricResonance = 0;
let newOzoneKillers = [];

```
// Electromagnetic coupling with geometric resonance
for (let i = 0; i < aluminum.length; i++) {
  for (let j = 0; j < sulfur.length; j++) {
    const al = aluminum[i];
    const s = sulfur[j];
    
    const dx = s.x - al.x;
    const dy = s.y - al.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < al.couplingRadius) {
      // Electromagnetic coupling - includes frequency resonance
      const freqDiff = Math.abs(al.resonanceFreq - 100); // 100 MHz atmospheric frequency
      const resonanceFactor = 1 / (1 + freqDiff / 50);
      
      const emCoupling = (al.charge * s.charge * resonanceFactor) / (distance * distance);
      totalEmCoupling += Math.abs(emCoupling);
      
      // Thermodynamic coupling with nonlinear temperature dependence
      const tempDiff = Math.abs(al.temp - s.temp);
      const thermoCoupling = tempDiff * tempDiff / (distance + 1); // Quadratic scaling
      totalThermoCoupling += thermoCoupling;
      
      // Geometric resonance - particles in certain configurations amplify effects
      const angle = Math.atan2(dy, dx);
      const geometricFactor = Math.abs(Math.sin(3 * angle)); // Triple resonance
      geometricResonance += geometricFactor * emCoupling;
      
      // Catalytic ozone destruction - coupling creates destruction agents
      if (emCoupling > 0.1 && Math.random() < 0.02) {
        newOzoneKillers.push({
          x: (al.x + s.x) / 2,
          y: (al.y + s.y) / 2,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          destructionRate: emCoupling * 10,
          lifetime: 100 + Math.random() * 200
        });
      }
    }
  }
}

// Photochemical coupling - light interactions with charged particles
const avgCharge = aluminum.reduce((sum, al) => sum + Math.abs(al.charge), 0) / aluminum.length;
totalPhotoCoupling = avgCharge * totalEmCoupling * 0.1;

return {
  electromagneticCoupling: totalEmCoupling,
  thermodynamicCoupling: totalThermoCoupling,
  photochemicalCoupling: totalPhotoCoupling,
  geometricResonance: geometricResonance,
  newOzoneKillers: newOzoneKillers
};
```

};

// Nonlinear threshold equations
const calculateThresholdEffects = (ozone, couplingStrength, time) => {
// Critical thresholds (Dobson Units)
const criticalThresholds = [280, 250, 220, 180, 150, 100];

```
// Coupling amplification increases near thresholds
let amplification = 1.0;
let cascadeRisk = 0;
let powerLawExponent = 0;

for (let threshold of criticalThresholds) {
  const proximityToThreshold = Math.abs(ozone - threshold);
  
  if (proximityToThreshold < 20) {
    // Amplification increases as we approach thresholds
    const proximityFactor = (20 - proximityToThreshold) / 20;
    amplification += proximityFactor * proximityFactor * 2; // Quadratic amplification
    
    // Cascade risk calculation
    cascadeRisk += proximityFactor * couplingStrength * 0.1;
    
    // Power law exponent - shows how damage scales
    if (ozone < threshold) {
      powerLawExponent = 1.5 + (threshold - ozone) / 50; // Increases below thresholds
    }
  }
}

// Additional nonlinear effects
if (ozone < 220) {
  // Below 220 DU, enter cascade regime
  const cascadeDepth = (220 - ozone) / 220;
  amplification *= (1 + cascadeDepth * cascadeDepth * 5); // Exponential amplification
  powerLawExponent += cascadeDepth * 2;
}

if (ozone < 150) {
  // Critical threshold - runaway destruction possible
  amplification *= 3;
  cascadeRisk += 0.5;
  powerLawExponent += 1;
}

return {
  couplingAmplification: amplification,
  cascadeRisk: Math.min(cascadeRisk, 1.0),
  powerLawExponent: powerLawExponent
};
```

};

// Ozone depletion with nonlinear coupling
const calculateOzoneDepletion = (currentOzone, aluminum, sulfur, killers, coupling, amplification) => {
// Base depletion rates
const aluminumDepletion = aluminum.length * 0.015; // DU per timestep
const sulfurDepletion = sulfur.length * 0.025;

```
// Catalytic destruction from coupling-created agents
const catalyticDepletion = killers.reduce((sum, k) => sum + k.destructionRate, 0);

// Electromagnetic coupling accelerates destruction (nonlinear)
const emAcceleration = Math.pow(coupling.electromagneticCoupling / 100, 1.5) * 2;

// Thermodynamic coupling creates hot spots that accelerate reactions
const thermoAcceleration = Math.pow(coupling.thermodynamicCoupling / 50, 1.3) * 1.5;

// Geometric resonance - can amplify destruction by orders of magnitude
const resonanceMultiplier = 1 + coupling.geometricResonance / 20;

// Total depletion with amplification
const totalDepletion = (
  aluminumDepletion + 
  sulfurDepletion + 
  catalyticDepletion + 
  emAcceleration + 
  thermoAcceleration
) * amplification * resonanceMultiplier;

return Math.max(50, currentOzone - totalDepletion); // Floor at 50 DU
```

};

// Economic impact with power law scaling
const calculateEconomicImpact = (ozone, temp, coupling, powerLaw) => {
const ozoneDeficit = Math.max(0, 280 - ozone);

```
// Power law scaling for economic damage
// Damage = k * (deficit)^exponent
const exponent = Math.max(1.5, powerLaw);

const ozoneDamage = 0.5 * Math.pow(ozoneDeficit, exponent) / 10;
const agriculturalLoss = 0.8 * Math.pow(ozoneDeficit, exponent + 0.2) / 8;
const healthCosts = 0.6 * Math.pow(ozoneDeficit, exponent + 0.1) / 9;

// Coupling effects add multiplicative damage
const couplingMultiplier = 1 + coupling.electromagneticCoupling / 50 + coupling.geometricResonance / 30;

const climateDisruption = (
  Math.abs(temp - 15) * 2 + 
  coupling.electromagneticCoupling * 0.5 +
  coupling.thermodynamicCoupling * 0.3
) * couplingMultiplier;

// Cascade risk creates additional systemic costs
const systemicRisk = atmosphericState.cascadeRisk * 50; // Billions

return {
  ozoneDamage,
  agriculturalLoss,
  healthCosts,
  climateDisruption,
  systemicRisk,
  totalCost: ozoneDamage + agriculturalLoss + healthCosts + climateDisruption + systemicRisk
};
```

};

// Main simulation loop
useEffect(() => {
if (!isRunning) return;

```
const interval = setInterval(() => {
  setTime(t => t + 1);
  
  setAgents(prev => {
    // Update aluminum particles
    const newAluminum = prev.aluminum.map(al => {
      let fx = 0, fy = 0, heatGain = 0;
      let resonanceBoost = 1.0;

      prev.sulfur.forEach(s => {
        const dx = s.x - al.x;
        const dy = s.y - al.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1;
        
        if (dist < al.couplingRadius) {
          // Electromagnetic force with resonance
          const freqMatch = 1 - Math.abs(al.resonanceFreq - 100) / 200;
          const force = (al.charge * s.charge * freqMatch) / (dist * dist) * 0.15;
          fx += force * dx / dist;
          fy += force * dy / dist;
          
          // Nonlinear heat transfer
          const tempDiff = s.temp - al.temp;
          heatGain += tempDiff * tempDiff * 0.001 * Math.sign(tempDiff);
          
          // Resonance amplification
          if (freqMatch > 0.8) {
            resonanceBoost *= 1.1;
          }
        }
      });

      const newTemp = al.temp + heatGain;
      const newVx = (al.vx + fx * 0.1) * resonanceBoost;
      const newVy = (al.vy + fy * 0.1) * resonanceBoost;
      
      let newX = al.x + newVx;
      let newY = al.y + newVy;

      if (newX < 0 || newX > 800) newVx *= -0.7;
      if (newY < 0 || newY > 400) newVy *= -0.7;
      newX = Math.max(0, Math.min(800, newX));
      newY = Math.max(0, Math.min(400, newY));

      return {
        ...al,
        x: newX,
        y: newY,
        vx: newVx * 0.98,
        vy: newVy * 0.98,
        temp: newTemp
      };
    });

    // Update sulfur particles
    const newSulfur = prev.sulfur.map(s => {
      let fx = 0, fy = 0, heatGain = 0;

      prev.aluminum.forEach(al => {
        const dx = al.x - s.x;
        const dy = al.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1;
        
        if (dist < 25) {
          const force = (s.charge * al.charge) / (dist * dist) * 0.12;
          fx += force * dx / dist;
          fy += force * dy / dist;

          const tempDiff = al.temp - s.temp;
          heatGain += tempDiff * tempDiff * 0.0008 * Math.sign(tempDiff);
        }
      });

      const newTemp = s.temp + heatGain;
      let newX = s.x + s.vx + fx * 0.1;
      let newY = s.y + s.vy + fy * 0.1;

      if (newX < 0 || newX > 800) s.vx *= -0.7;
      if (newY < 0 || newY > 400) s.vy *= -0.7;
      newX = Math.max(0, Math.min(800, newX));
      newY = Math.max(0, Math.min(400, newY));

      return {
        ...s,
        x: newX,
        y: newY,
        temp: newTemp
      };
    });

    // Update ozone killers (catalytic agents)
    const newKillers = prev.ozoneKillers
      .filter(k => k.lifetime > 0)
      .map(k => ({
        ...k,
        x: k.x + k.vx,
        y: k.y + k.vy,
        lifetime: k.lifetime - 1
      }));

    return {
      aluminum: newAluminum,
      sulfur: newSulfur,
      ozoneKillers: newKillers
    };
  });

  // Calculate coupling effects
  const coupling = calculateCouplingEffects(agents.aluminum, agents.sulfur, time);
  
  setCouplingMetrics({
    electromagneticCoupling: coupling.electromagneticCoupling,
    thermodynamicCoupling: coupling.thermodynamicCoupling,
    photochemicalCoupling: coupling.photochemicalCoupling,
    geometricResonance: coupling.geometricResonance,
    nonlinearityIndex: (coupling.electromagneticCoupling + coupling.geometricResonance) / 50
  });

  // Add new catalytic ozone killers
  if (coupling.newOzoneKillers && coupling.newOzoneKillers.length > 0) {
    setAgents(prev => ({
      ...prev,
      ozoneKillers: [...prev.ozoneKillers, ...coupling.newOzoneKillers]
    }));
  }

  // Calculate threshold effects
  const thresholdEffects = calculateThresholdEffects(
    atmosphericState.ozoneConcentration,
    coupling.electromagneticCoupling,
    time
  );

  // Update atmospheric state
  setAtmosphericState(prev => {
    const newOzone = calculateOzoneDepletion(
      prev.ozoneConcentration,
      agents.aluminum,
      agents.sulfur,
      agents.ozoneKillers,
      coupling,
      thresholdEffects.couplingAmplification
    );

    const avgTemp = (
      agents.aluminum.reduce((sum, al) => sum + al.temp, 0) / agents.aluminum.length +
      agents.sulfur.reduce((sum, s) => sum + s.temp, 0) / agents.sulfur.length
    ) / 2 || 15;

    return {
      ozoneConcentration: newOzone,
      temperature: avgTemp,
      aluminumDensity: agents.aluminum.length / 32,
      sulfurDensity: agents.sulfur.length / 32,
      emFieldStrength: coupling.electromagneticCoupling,
      couplingAmplification: thresholdEffects.couplingAmplification,
      cascadeRisk: thresholdEffects.cascadeRisk,
      powerLawExponent: thresholdEffects.powerLawExponent
    };
  });

  // Record threshold data for graphing
  setThresholdData(prev => {
    const newData = [...prev, {
      time: time,
      ozone: atmosphericState.ozoneConcentration,
      amplification: atmosphericState.couplingAmplification,
      cascadeRisk: atmosphericState.cascadeRisk
    }];
    return newData.slice(-100); // Keep last 100 points
  });

}, 50);

return () => clearInterval(interval);
```

}, [isRunning, agents, atmosphericState, time]);

// Canvas rendering
useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;

```
const ctx = canvas.getContext('2d');

// Background gradient based on ozone level
const ozoneHealth = atmosphericState.ozoneConcentration / 280;
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, `rgba(10, 10, 40, 1)`);
gradient.addColorStop(1, `rgba(${255 * (1 - ozoneHealth)}, 10, ${100 * ozoneHealth}, 1)`);
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 800, 400);

// Draw coupling field visualization
if (atmosphericState.emFieldStrength > 5) {
  ctx.strokeStyle = `rgba(150, 100, 255, ${Math.min(atmosphericState.emFieldStrength / 50, 0.3)})`;
  ctx.lineWidth = 2;
  for (let i = 0; i < agents.aluminum.length; i++) {
    for (let j = 0; j < agents.sulfur.length; j++) {
      const al = agents.aluminum[i];
      const s = agents.sulfur[j];
      const dist = Math.sqrt((s.x - al.x) ** 2 + (s.y - al.y) ** 2);
      if (dist < al.couplingRadius) {
        ctx.beginPath();
        ctx.moveTo(al.x, al.y);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
    }
  }
}

// Draw ozone killer agents
agents.ozoneKillers.forEach(k => {
  ctx.fillStyle = `rgba(255, 0, 0, ${k.lifetime / 300})`;
  ctx.beginPath();
  ctx.arc(k.x, k.y, 2 + k.destructionRate, 0, Math.PI * 2);
  ctx.fill();
});

// Draw aluminum particles with resonance indicators
agents.aluminum.forEach(al => {
  const heat = Math.min((al.temp - 15) / 10, 1);
  const resonance = (al.resonanceFreq - 50) / 200;
  
  ctx.fillStyle = `rgba(${180 + 75 * heat}, ${180 - 80 * heat}, ${200 + 55 * resonance}, 0.9)`;
  ctx.strokeStyle = `rgba(255, ${200 * (1 - heat)}, 100, 0.7)`;
  ctx.lineWidth = 1 + heat;
  ctx.beginPath();
  ctx.arc(al.x, al.y, 4 + resonance * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Resonance rings
  if (resonance > 0.6) {
    ctx.strokeStyle = `rgba(150, 100, 255, ${resonance * 0.3})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(al.x, al.y, al.couplingRadius * 0.5, 0, Math.PI * 2);
    ctx.stroke();
  }
});

// Draw sulfur dioxide
agents.sulfur.forEach(s => {
  const heat = Math.min((s.temp - 15) / 10, 1);
  ctx.fillStyle = `rgba(230, ${230 - 100 * heat}, 100, 0.8)`;
  ctx.strokeStyle = `rgba(255, ${200 * (1 - heat)}, 0, 0.6)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(s.x, s.y, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
});
```

}, [agents, atmosphericState]);

const economicImpact = calculateEconomicImpact(
atmosphericState.ozoneConcentration,
atmosphericState.temperature,
couplingMetrics,
atmosphericState.powerLawExponent
);

const reset = () => {
window.location.reload();
};

// Determine regime
const getRegime = (ozone) => {
if (ozone > 250) return { name: ‘Stable’, color: ‘text-green-400’ };
if (ozone > 220) return { name: ‘Degraded’, color: ‘text-yellow-400’ };
if (ozone > 180) return { name: ‘Critical’, color: ‘text-orange-400’ };
if (ozone > 150) return { name: ‘Cascade’, color: ‘text-red-400’ };
return { name: ‘Collapse’, color: ‘text-red-600’ };
};

const regime = getRegime(atmosphericState.ozoneConcentration);

return (
<div className="w-full max-w-7xl mx-auto p-6 bg-slate-900 rounded-lg shadow-2xl">
<div className="mb-6">
<h1 className="text-3xl font-bold text-white mb-2">
Advanced Atmospheric Coupling Analysis
</h1>
<p className="text-slate-300 text-sm">
Nonlinear threshold effects, power law scaling, and cascade risk modeling
</p>
</div>

```
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    {/* Main visualization */}
    <div className="lg:col-span-2">
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="mb-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">Atmospheric Regime:</span>
            <span className={`text-xl font-bold ${regime.color}`}>{regime.name}</span>
          </div>
        </div>
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400}
          className="w-full rounded border-2 border-slate-700"
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
      </div>

      {/* Coupling equations display */}
      <div className="bg-slate-800 rounded-lg p-4 mt-4">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Eye size={18} />
          Active Coupling Equations
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-purple-400 mb-1">Electromagnetic:</div>
            <div className="text-slate-300">F = q₁q₂R(f) / r²</div>
            <div className="text-slate-400 text-[10px]">R(f) = resonance factor</div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-orange-400 mb-1">Thermodynamic:</div>
            <div className="text-slate-300">Q = ΔT² / (r + 1)</div>
            <div className="text-slate-400 text-[10px]">Quadratic temperature coupling</div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-cyan-400 mb-1">Amplification:</div>
            <div className="text-slate-300">A = 1 + Σ(p²) × C</div>
            <div className="text-slate-400 text-[10px]">p = proximity to threshold</div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-red-400 mb-1">Power Law:</div>
            <div className="text-slate-300">D = k × δ^α</div>
            <div className="text-slate-400 text-[10px]">α = {atmosphericState.powerLawExponent.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>

    {/* Metrics panel */}
    <div className="space-y-4">
      {/* Ozone Status */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <TrendingDown size={20} className={regime.color.replace('text-', 'text-')} />
          Ozone Concentration
        </h3>
        <div className="text-center mb-3">
          <div className={`text-4xl font-bold ${regime.color}`}>
            {atmosphericState.ozoneConcentration.toFixed(1)}
          </div>
          <div className="text-slate-400 text-sm">Dobson Units</div>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Normal (280 DU)</span>
            <span className="text-green-400">✓</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Degraded (250 DU)</span>
            <span className={atmosphericState.ozoneConcentration < 250 ? 'text-yellow-400' : 'text-slate-600'}>
              {atmosphericState.ozoneConcentration < 250 ? '✗' : '○'}
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Critical (220 DU)</span>
            <span className={atmosphericState.ozoneConcentration < 220 ? 'text-orange-400' : 'text-slate-600'}>
              {atmosphericState.ozoneConcentration < 220 ? '✗' : '○'}
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Cascade (180 DU)</span>
            <span className={atmosphericState.ozoneConcentration < 180 ? 'text-red-400' : 'text-slate-600'}>
              {atmosphericState.ozoneConcentration < 180 ? '✗' : '○'}
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Collapse (150 DU)</span>
            <span className={atmosphericState.ozoneConcentration < 150 ? 'text-red-600 font-bold' : 'text-slate-600'}>
              {atmosphericState.ozoneConcentration < 150 ? '✗✗' : '○'}
            </span>
          </div>
        </div>
      </div>

      {/* Coupling Metrics */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Zap size={20} className="text-yellow-400" />
          Coupling Strength
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-purple-300">Electromagnetic</span>
              <span className="text-purple-400 font-semibold">
                {couplingMetrics.electromagneticCoupling.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, couplingMetrics.electromagneticCoupling)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-orange-300">Thermodynamic</span>
              <span className="text-orange-400 font-semibold">
                {couplingMetrics.thermodynamicCoupling.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, couplingMetrics.thermodynamicCoupling)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-pink-300">Geometric Resonance</span>
              <span className="text-pink-400 font-semibold">
                {couplingMetrics.geometricResonance.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, couplingMetrics.geometricResonance / 2)}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700">
            <div className="flex justify-between mb-1">
              <span className="text-cyan-300">Nonlinearity Index</span>
              <span className="text-cyan-400 font-semibold">
                {couplingMetrics.nonlinearityIndex.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Threshold Effects */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
          <Thermometer size={20} />
          Threshold Effects
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Coupling Amplification:</span>
            <span className={atmosphericState.couplingAmplification > 2 ? 'text-red-400 font-bold' : 'text-yellow-400'}>
              {atmosphericState.couplingAmplification.toFixed(2)}×
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Cascade Risk:</span>
            <span className={atmosphericState.cascadeRisk > 0.5 ? 'text-red-400 font-bold' : 'text-orange-400'}>
              {(atmosphericState.cascadeRisk * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Power Law Exponent:</span>
            <span className="text-purple-400 font-mono">
              α = {atmosphericState.powerLawExponent.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Catalytic Agents:</span>
            <span className={agents.ozoneKillers.length > 10 ? 'text-red-400' : 'text-yellow-400'}>
              {agents.ozoneKillers.length}
            </span>
          </div>
        </div>
      </div>

      {/* Economic Impact */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">
          Economic Impact (Annual)
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Ozone Damage:</span>
            <span className="text-red-400 font-semibold">${economicImpact.ozoneDamage.toFixed(1)}B</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Agricultural Loss:</span>
            <span className="text-orange-400 font-semibold">${economicImpact.agriculturalLoss.toFixed(1)}B</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Health Costs:</span>
            <span className="text-yellow-400 font-semibold">${economicImpact.healthCosts.toFixed(1)}B</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Climate Disruption:</span>
            <span className="text-purple-400 font-semibold">${economicImpact.climateDisruption.toFixed(1)}B</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Systemic Risk:</span>
            <span className="text-pink-400 font-semibold">${economicImpact.systemicRisk.toFixed(1)}B</span>
          </div>
          <div className="border-t border-slate-700 pt-2 mt-2">
            <div className="flex justify-between text-white font-bold text-base">
              <span>Total Cost:</span>
              <span className="text-red-400">${economicImpact.totalCost.toFixed(1)}B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Explanation */}
  <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300">
    <h4 className="font-semibold text-white mb-3">Nonlinear Coupling Dynamics:</h4>
    <div className="space-y-2">
      <p>
        <span className="text-purple-400 font-semibold">Electromagnetic Coupling:</span> Charged particles create field interactions that amplify near resonance frequencies. Geometric arrangements create constructive interference.
      </p>
      <p>
        <span className="text-orange-400 font-semibold">Thermodynamic Coupling:</span> Heat transfer follows quadratic scaling (ΔT²), creating nonlinear temperature feedback loops.
      </p>
      <p>
        <span className="text-red-400 font-semibold">Threshold Amplification:</span> Near critical ozone levels (280, 250, 220, 180, 150 DU), coupling effects amplify quadratically. Below 220 DU, system enters cascade regime.
      </p>
      <p>
        <span className="text-pink-400 font-semibold">Power Law Scaling:</span> Economic damage scales as D = k × δ^α where α increases with ozone depletion. Linear models underestimate costs by orders of magnitude.
      </p>
      <p>
        <span className="text-cyan-400 font-semibold">Catalytic Agents:</span> Electromagnetic coupling creates new chemical species (shown as red particles) that catalytically destroy ozone - an emergent effect not in linear models.
      </p>
    </div>
    <div className="mt-3 p-3 bg-red-900/30 border border-red-500/30 rounded">
      <p className="text-yellow-400 font-semibold">
        ⚠ Critical Insight: The coupling effects create positive feedback loops. Once cascade regime is reached (&lt;220 DU), amplification factors can exceed 3×, making recovery extremely difficult. This nonlinear behavior is invisible to linear economic models.
      </p>
    </div>
    <p className="mt-3 text-slate-400 text-xs">
      Time: {time} | Power Law Exponent: {atmosphericState.powerLawExponent.toFixed(2)} | Amplification: {atmosphericState.couplingAmplification.toFixed(2)}×
    </p>
  </div>
</div>
```

);
};

export default AdvancedAtmosphericCouplingModel;
