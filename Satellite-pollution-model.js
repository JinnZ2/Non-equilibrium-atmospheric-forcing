import React, { useState, useEffect, useRef } from ‘react’;
import { Play, Pause, RotateCcw, Satellite, AlertTriangle, Zap } from ‘lucide-react’;

const SatelliteAluminumPollutionModel = () => {
const canvasRef = useRef(null);
const [isRunning, setIsRunning] = useState(false);
const [time, setTime] = useState(0);

const [satelliteParams, setSatelliteParams] = useState({
reentryRate: 2,
averageMass: 550,
aluminumContent: 0.15,
burnupAltitude: 85,
particleSize: 0.05,
});

const [atmosphericState, setAtmosphericState] = useState({
ozoneConcentration: 280,
aluminumDensity: 0,
totalAluminumMass: 0,
emFieldStrength: 0,
temperature: 15,
conductivityChange: 0,
polarizationDistortion: 0
});

const [couplingEffects, setCouplingEffects] = useState({
electromagneticAmplification: 1.0,
catalyticDestruction: 0,
radiativeForcing: 0,
thermosphereHeating: 0,
ionosphericDisruption: 0
});

const [economicImpact, setEconomicImpact] = useState({
ozoneDepletion: 0,
navigationDisruption: 0,
climateForcing: 0,
healthDamage: 0,
agricultureLoss: 0,
totalCost: 0
});

const [particles, setParticles] = useState({
aluminumOxide: [],
ozoneKillers: [],
satellites: []
});

useEffect(() => {
const initialParticles = Array.from({ length: 30 }, () => ({
x: Math.random() * 800,
y: 200 + Math.random() * 150,
vx: (Math.random() - 0.5) * 0.2,
vy: (Math.random() - 0.5) * 0.1,
charge: Math.random() * 2 - 1,
size: 0.02 + Math.random() * 0.08,
age: Math.random() * 1000,
temp: -40 + Math.random() * 20,
reactivity: Math.random()
}));

```
setParticles({
  aluminumOxide: initialParticles,
  ozoneKillers: [],
  satellites: []
});
```

}, []);

const calculateAluminumInjection = (reentryRate, avgMass, alContent, timeStep) => {
const aluminumPerStep = (reentryRate / 86400) * avgMass * alContent * timeStep * 50;
const particleMass = 4.0e-18;
const newParticles = Math.floor(aluminumPerStep / particleMass);

```
return {
  massInjected: aluminumPerStep,
  particleCount: newParticles
};
```

};

const calculateElectromagneticCoupling = (particles) => {
let totalFieldStrength = 0;
let conductivityChange = 0;
let electromagneticAmplification = 1.0;

```
particles.forEach(p => {
  conductivityChange += (p.size * p.size * Math.abs(p.charge)) / 1000;
  totalFieldStrength += Math.abs(p.charge) * (p.size * p.size);
});

const density = particles.length / 1000;
electromagneticAmplification = 1.0 + Math.pow(density, 1.3) * 2;

const baseConductivity = 1.0e-14;
const newConductivity = baseConductivity * (1 + conductivityChange);

return {
  fieldStrength: totalFieldStrength,
  conductivityRatio: newConductivity / baseConductivity,
  amplification: electromagneticAmplification
};
```

};

const calculateOzoneDestruction = (particles, currentOzone) => {
let catalyticDestruction = 0;
let newKillers = [];

```
particles.forEach(p => {
  const catalyticRate = p.size * p.size * p.reactivity * 0.001;
  catalyticDestruction += catalyticRate;

  if (Math.random() < catalyticRate * 10) {
    newKillers.push({
      x: p.x + (Math.random() - 0.5) * 10,
      y: p.y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      destructionRate: catalyticRate * 100,
      lifetime: 50 + Math.random() * 100,
      source: 'aluminum_catalysis'
    });
  }
});

const destructionRate = catalyticDestruction * 0.05;
const emField = calculateElectromagneticCoupling(particles).fieldStrength;
const emDestructionRate = Math.pow(emField / 1000, 1.2) * 0.02;

const totalDestruction = destructionRate + emDestructionRate;
const newOzone = Math.max(50, currentOzone - totalDestruction);

return {
  newOzone: newOzone,
  destructionRate: totalDestruction,
  catalyticContribution: destructionRate,
  electromagneticContribution: emDestructionRate,
  newKillers: newKillers
};
```

};

const calculateRadiativeForcing = (particles) => {
const totalScatteringArea = particles.reduce((sum, p) => sum + Math.PI * p.size * p.size, 0);
const albedoEffect = -totalScatteringArea * 0.001;
const absorptionEffect = totalScatteringArea * 0.0008;
return albedoEffect + absorptionEffect;
};

const calculateIonosphericEffects = (particles, emAmplification) => {
const particleDensity = particles.length / 1000;
const radioDisruption = particleDensity * emAmplification * 0.5;
const gpsDisruption = Math.min(1.0, particleDensity * 0.8);
const commDisruption = Math.min(1.0, particleDensity * emAmplification * 0.3);

```
return {
  radioDisruption,
  gpsDisruption,
  commDisruption,
  totalDisruption: (radioDisruption + gpsDisruption + commDisruption) / 3
};
```

};

const calculateEconomicImpacts = (atmosphericState, couplingEffects, ionosphericEffects) => {
const ozoneDeficit = Math.max(0, 280 - atmosphericState.ozoneConcentration);
const powerLawExponent = 1.5 + (ozoneDeficit / 100);

```
const ozoneDepletion = 0.4 * Math.pow(ozoneDeficit, powerLawExponent) / 10;
const navigationDisruption = ionosphericEffects.gpsDisruption * 15 + ionosphericEffects.commDisruption * 8;
const climateForcing = Math.abs(couplingEffects.radiativeForcing) * 20;
const healthDamage = 0.5 * Math.pow(ozoneDeficit, powerLawExponent + 0.1) / 12;
const agricultureLoss = 0.7 * Math.pow(ozoneDeficit, powerLawExponent + 0.2) / 9 +
                       Math.abs(couplingEffects.radiativeForcing) * 5;

const emMultiplier = couplingEffects.electromagneticAmplification;

return {
  ozoneDepletion: ozoneDepletion * emMultiplier,
  navigationDisruption,
  climateForcing,
  healthDamage: healthDamage * emMultiplier,
  agricultureLoss: agricultureLoss * emMultiplier,
  totalCost: (ozoneDepletion + navigationDisruption + climateForcing + healthDamage + agricultureLoss) * emMultiplier
};
```

};

useEffect(() => {
if (!isRunning) return;

```
const interval = setInterval(() => {
  setTime(t => t + 1);
  
  const injection = calculateAluminumInjection(
    satelliteParams.reentryRate,
    satelliteParams.averageMass,
    satelliteParams.aluminumContent,
    0.05
  );

  setParticles(prev => {
    const newAluminumParticles = Array.from({ length: Math.min(injection.particleCount, 3) }, () => ({
      x: Math.random() * 800,
      y: 50 + Math.random() * 50,
      vx: (Math.random() - 0.5) * 0.5,
      vy: 0.2 + Math.random() * 0.3,
      charge: Math.random() * 2 - 1,
      size: satelliteParams.particleSize * (0.5 + Math.random()),
      age: 0,
      temp: -60 + Math.random() * 30,
      reactivity: 0.3 + Math.random() * 0.7
    }));

    const updatedAluminum = [...prev.aluminumOxide, ...newAluminumParticles].map(p => {
      let newVx = p.vx;
      let newVy = p.vy + 0.01;
      
      let fx = 0, fy = 0;
      prev.aluminumOxide.forEach(other => {
        if (other !== p) {
          const dx = other.x - p.x;
          const dy = other.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          
          if (dist < 30) {
            const force = (p.charge * other.charge) / (dist * dist) * 0.05;
            fx += force * dx / dist;
            fy += force * dy / dist;
          }
        }
      });
      
      newVx += fx;
      newVy += fy;
      
      let newX = p.x + newVx;
      let newY = p.y + newVy;
      
      if (newX < 0 || newX > 800) newVx *= -0.8;
      if (newY < 150) newVy *= -0.8;
      if (newY > 400) newVy *= -0.9;
      
      newX = Math.max(0, Math.min(800, newX));
      newY = Math.max(150, Math.min(400, newY));
      
      return {
        ...p,
        x: newX,
        y: newY,
        vx: newVx * 0.98,
        vy: newVy * 0.98,
        age: p.age + 1
      };
    }).filter(p => p.age < 5000);

    const updatedKillers = prev.ozoneKillers
      .filter(k => k.lifetime > 0)
      .map(k => ({
        ...k,
        x: k.x + k.vx,
        y: k.y + k.vy,
        lifetime: k.lifetime - 1
      }));

    const newSatellites = [];
    if (Math.random() < 0.05) {
      newSatellites.push({
        x: Math.random() * 800,
        y: 0,
        vx: (Math.random() - 0.5) * 2,
        vy: 3 + Math.random() * 2,
        size: 2 + Math.random() * 3,
        burning: false
      });
    }

    const updatedSatellites = [...prev.satellites, ...newSatellites]
      .filter(s => s.y < 400)
      .map(s => ({
        ...s,
        x: s.x + s.vx,
        y: s.y + s.vy,
        burning: s.y > 50
      }));

    return {
      aluminumOxide: updatedAluminum,
      ozoneKillers: updatedKillers,
      satellites: updatedSatellites
    };
  });

  const emCoupling = calculateElectromagneticCoupling(particles.aluminumOxide);
  const ozoneResult = calculateOzoneDestruction(particles.aluminumOxide, atmosphericState.ozoneConcentration);
  const radiativeForcing = calculateRadiativeForcing(particles.aluminumOxide);
  const ionosphericEffects = calculateIonosphericEffects(particles.aluminumOxide, emCoupling.amplification);

  if (ozoneResult.newKillers.length > 0) {
    setParticles(prev => ({
      ...prev,
      ozoneKillers: [...prev.ozoneKillers, ...ozoneResult.newKillers]
    }));
  }

  setAtmosphericState(prev => ({
    ozoneConcentration: ozoneResult.newOzone,
    aluminumDensity: particles.aluminumOxide.length / 100,
    totalAluminumMass: prev.totalAluminumMass + injection.massInjected,
    emFieldStrength: emCoupling.fieldStrength,
    temperature: 15 + radiativeForcing * 0.5,
    conductivityChange: emCoupling.conductivityRatio - 1,
    polarizationDistortion: particles.aluminumOxide.length * 0.001
  }));

  setCouplingEffects({
    electromagneticAmplification: emCoupling.amplification,
    catalyticDestruction: ozoneResult.catalyticContribution,
    radiativeForcing: radiativeForcing,
    thermosphereHeating: particles.aluminumOxide.length * 0.01,
    ionosphericDisruption: ionosphericEffects.totalDisruption
  });

  const impacts = calculateEconomicImpacts(
    atmosphericState,
    { ...couplingEffects, radiativeForcing: radiativeForcing },
    ionosphericEffects
  );
  
  setEconomicImpact(impacts);

}, 50);

return () => clearInterval(interval);
```

}, [isRunning, particles, atmosphericState, satelliteParams, couplingEffects]);

useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;

```
const ctx = canvas.getContext('2d');

const gradient = ctx.createLinearGradient(0, 0, 0, 400);
const ozoneHealth = atmosphericState.ozoneConcentration / 280;
gradient.addColorStop(0, 'rgba(5, 5, 30, 1)');
gradient.addColorStop(0.4, `rgba(20, 20, ${100 * ozoneHealth}, 1)`);
gradient.addColorStop(1, `rgba(${200 * (1 - ozoneHealth)}, 30, 60, 1)`);
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 800, 400);

ctx.strokeStyle = 'rgba(100, 100, 150, 0.3)';
ctx.lineWidth = 2;
ctx.setLineDash([5, 5]);
ctx.beginPath();
ctx.moveTo(0, 150);
ctx.lineTo(800, 150);
ctx.stroke();
ctx.setLineDash([]);

ctx.fillStyle = 'rgba(150, 150, 200, 0.5)';
ctx.font = '12px monospace';
ctx.fillText('Stratosphere (15-50 km)', 10, 170);

if (atmosphericState.emFieldStrength > 10) {
  ctx.strokeStyle = `rgba(150, 100, 255, ${Math.min(atmosphericState.emFieldStrength / 100, 0.4)})`;
  ctx.lineWidth = 1;
  
  for (let i = 0; i < particles.aluminumOxide.length; i += 3) {
    const p1 = particles.aluminumOxide[i];
    for (let j = i + 1; j < Math.min(i + 4, particles.aluminumOxide.length); j++) {
      const p2 = particles.aluminumOxide[j];
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

particles.satellites.forEach(s => {
  if (s.burning) {
    ctx.fillStyle = `rgba(255, 150, 50, ${0.8 - s.y / 500})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2);
    ctx.fill();
    
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = `rgba(255, 200, 100, ${0.5 - i * 0.15})`;
      ctx.beginPath();
      ctx.arc(s.x + (Math.random() - 0.5) * 10, s.y - i * 10, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = 'rgba(200, 200, 220, 0.9)';
    ctx.fillRect(s.x - s.size/2, s.y - s.size/2, s.size, s.size);
  }
});

particles.ozoneKillers.forEach(k => {
  const alpha = k.lifetime / 150;
  ctx.fillStyle = `rgba(255, 50, 50, ${alpha * 0.8})`;
  ctx.beginPath();
  ctx.arc(k.x, k.y, 2 + k.destructionRate * 0.5, 0, Math.PI * 2);
  ctx.fill();
});

particles.aluminumOxide.forEach(p => {
  const ageFactor = Math.min(p.age / 1000, 1);
  const chargeMagnitude = Math.abs(p.charge);
  
  if (chargeMagnitude > 0.7) {
    const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
    glowGradient.addColorStop(0, `rgba(180, 180, 255, ${chargeMagnitude * 0.3})`);
    glowGradient.addColorStop(1, 'rgba(180, 180, 255, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.fillStyle = `rgba(${180 + ageFactor * 50}, ${180 - ageFactor * 30}, ${200 + chargeMagnitude * 55}, ${0.7 + ageFactor * 0.3})`;
  ctx.strokeStyle = `rgba(255, ${220 - ageFactor * 50}, ${150 + chargeMagnitude * 105}, 0.8)`;
  ctx.lineWidth = 0.5 + chargeMagnitude * 0.5;
  
  const radius = 2 + p.size * 20;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
});
```

}, [particles, atmosphericState]);

const reset = () => {
window.location.reload();
};

const getRegime = (ozone) => {
if (ozone > 260) return { name: ‘Healthy’, color: ‘text-green-400’, desc: ‘Normal ozone levels’ };
if (ozone > 240) return { name: ‘Concern’, color: ‘text-yellow-400’, desc: ‘Early degradation’ };
if (ozone > 220) return { name: ‘Warning’, color: ‘text-orange-400’, desc: ‘Significant depletion’ };
if (ozone > 180) return { name: ‘Danger’, color: ‘text-red-400’, desc: ‘Critical threshold’ };
return { name: ‘Crisis’, color: ‘text-red-600’, desc: ‘Severe ozone loss’ };
};

const regime = getRegime(atmosphericState.ozoneConcentration);
const annualAluminumInjection = satelliteParams.reentryRate * 365 * satelliteParams.averageMass * satelliteParams.aluminumContent;

return (
<div className="w-full max-w-7xl mx-auto p-6 bg-slate-900 rounded-lg shadow-2xl">
<div className="mb-6">
<h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
<Satellite size={32} className="text-blue-400" />
Satellite Reentry Aluminum Pollution Model
</h1>
<p className="text-slate-300 text-sm">
Atmospheric coupling effects from satellite-derived aluminum oxide nanoparticles
</p>
</div>

```
  <div className="bg-slate-800 rounded-lg p-4 mb-6">
    <h3 className="text-white font-semibold mb-3">Satellite Reentry Parameters</h3>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
      <div>
        <label className="text-slate-400 block mb-1">Reentry Rate (per day)</label>
        <input
          type="number"
          value={satelliteParams.reentryRate}
          onChange={(e) => setSatelliteParams({...satelliteParams, reentryRate: parseFloat(e.target.value)})}
          className="w-full bg-slate-700 text-white px-3 py-2 rounded"
          min="0"
          max="10"
          step="0.5"
          disabled={isRunning}
        />
      </div>
      <div>
        <label className="text-slate-400 block mb-1">Avg Mass (kg)</label>
        <input
          type="number"
          value={satelliteParams.averageMass}
          onChange={(e) => setSatelliteParams({...satelliteParams, averageMass: parseFloat(e.target.value)})}
          className="w-full bg-slate-700 text-white px-3 py-2 rounded"
          min="100"
          max="2000"
          step="50"
          disabled={isRunning}
        />
      </div>
      <div>
        <label className="text-slate-400 block mb-1">Al Content (%)</label>
        <input
          type="number"
          value={satelliteParams.aluminumContent * 100}
          onChange={(e) => setSatelliteParams({...satelliteParams, aluminumContent: parseFloat(e.target.value) / 100})}
          className="w-full bg-slate-700 text-white px-3 py-2 rounded"
          min="5"
          max="30"
          step="1"
          disabled={isRunning}
        />
      </div>
      <div className="col-span-2">
        <div className="text-slate-400 mb-1">Annual Al Injection:</div>
        <div className="text-white font-semibold text-lg">
          {(annualAluminumInjection / 1000).toFixed(1)} metric tons/year
        </div>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    <div className="lg:col-span-2">
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <span className="text-slate-400">Regime:</span>
            <span className={`ml-2 text-xl font-bold ${regime.color}`}>{regime.name}</span>
          </div>
          <div className="text-slate-400 text-sm">{regime.desc}</div>
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
        <div className="mt-4 text-xs text-slate-400">
          <div className="flex justify-around">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-400 rounded-full"></div>
              <span>Al₂O₃ Particles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Catalytic Destruction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
              <span>Satellite Reentry</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Atmospheric Status</h3>
        <div className="space-y-3 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">Ozone Layer</span>
              <span className={`font-semibold ${regime.color}`}>
                {atmosphericState.ozoneConcentration.toFixed(1)} DU
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  atmosphericState.ozoneConcentration > 260 ? 'bg-green-500' :
                  atmosphericState.ozoneConcentration > 240 ? 'bg-yellow-500' :
                  atmosphericState.ozoneConcentration > 220 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${(atmosphericState.ozoneConcentration / 280) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Al₂O₃ Density:</span>
            <span className="text-purple-400 font-semibold">
              {atmosphericState.aluminumDensity.toFixed(2)} units
            </span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Total Al Mass:</span>
            <span className="text-cyan-400 font-semibold">
              {(atmosphericState.totalAluminumMass / 1000).toFixed(2)} kg
            </span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Particles:</span>
            <span className="text-blue-400 font-semibold">
              {particles.aluminumOxide.length}
            </span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Temperature:</span>
            <span className={Math.abs(atmosphericState.temperature - 15) > 1 ? 'text-orange-400' : 'text-green-400'}>
              {atmosphericState.temperature.toFixed(2)}°C
            </span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Zap size={18} className="text-yellow-400" />
          Coupling Effects
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-purple-300">EM Amplification</span>
              <span className="text-purple-400 font-semibold">
                {couplingEffects.electromagneticAmplification.toFixed(2)}×
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (couplingEffects.electromagneticAmplification - 1) * 50)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Catalytic O₃ Loss:</span>
            <span className="text-red-400 font-semibold">
              {couplingEffects.catalyticDestruction.toFixed(3)} DU/step
            </span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Radiative Forcing:</span>
            <span className={couplingEffects.radiativeForcing > 0 ? 'text-orange-400' : 'text-blue-400'}>
              {couplingEffects.radiativeForcing.toFixed(3)} W/m²
            </span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Ionospheric Disruption:</span>
            <span className="text-yellow-400 font-semibold">
              {(couplingEffects.ionosphericDisruption * 100).toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>EM Field Strength:</span>
            <span className="text-pink-400 font-semibold">
              {atmosphericState.emFieldStrength.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} />
          Economic Impact (Annual)
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Ozone Depletion:</span>
            <span className="text-red-400 font-semibold">${economicImpact.ozoneDepletion.toFixed(1)}B</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Navigation Loss:</span>
            <span className="text-orange-400 font-semibold">${economicImpact.navigationDisruption.toFixed(1)}B</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Climate Forcing:</span>
            <span className="text-yellow-400 font-semibold">${economicImpact.climateForcing.toFixed(1)}B</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Health Damage:</span>
            <span className="text-pink-400 font-semibold">${economicImpact.healthDamage.toFixed(1)}B</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Agriculture Loss:</span>
            <span className="text-purple-400 font-semibold">${economicImpact.agricultureLoss.toFixed(1)}B</span>
          </div>
          <div className="border-t border-red-500/30 pt-2 mt-2">
            <div className="flex justify-between text-white font-bold text-base">
              <span>Total Cost:</span>
              <span className="text-red-400">${economicImpact.totalCost.toFixed(1)}B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300">
    <h4 className="font-semibold text-white mb-3">Satellite Aluminum Pollution Dynamics:</h4>
    <div className="space-y-2">
      <p>
        <span className="text-blue-400 font-semibold">Current Satellite Reentry Rate:</span> With mega-constellations like Starlink, thousands of satellites will reenter annually. At {satelliteParams.reentryRate} satellites/day ({annualAluminumInjection.toFixed(0)} kg aluminum/year), we're injecting conductive nanoparticles into the stratosphere.
      </p>
      <p>
        <span className="text-purple-400 font-semibold">Electromagnetic Coupling:</span> Aluminum oxide particles are conductive and charged. They increase atmospheric conductivity by {((atmosphericState.conductivityChange) * 100).toFixed(1)}%, creating electromagnetic field amplification of {couplingEffects.electromagneticAmplification.toFixed(2)}×.
      </p>
      <p>
        <span className="text-red-400 font-semibold">Catalytic Ozone Destruction:</span> Al₂O₃ particles act as catalysts in ozone destruction reactions, similar to CFCs but through different pathways. The red particles show active catalytic destruction events.
      </p>
      <p>
        <span className="text-orange-400 font-semibold">Ionospheric Disruption:</span> Conductive particles interfere with radio wave propagation, degrading GPS accuracy, satellite communications, and navigation systems. Current disruption: {(couplingEffects.ionosphericDisruption * 100).toFixed(1)}%.
      </p>
      <p>
        <span className="text-yellow-400 font-semibold">Radiative Effects:</span> Aluminum particles both reflect and absorb radiation. Net forcing: {couplingEffects.radiativeForcing > 0 ? 'warming' : 'cooling'} at {Math.abs(couplingEffects.radiativeForcing).toFixed(3)} W/m².
      </p>
    </div>
    <div className="mt-3 p-3 bg-red-900/30 border border-red-500/30 rounded">
      <p className="text-yellow-400 font-semibold">
        ⚠️ Critical Issue: Unlike one-time CFC pollution, satellite reentry is CONTINUOUS. As mega-constellations grow (Starlink alone plans 42,000 satellites with 5-year lifetimes = 8,400 reentries/year), aluminum accumulation will accelerate. The electromagnetic coupling effects are completely absent from current environmental impact assessments.
      </p>
    </div>
    <p className="mt-3 text-slate-400 text-xs">
      Time: {time} | Al Particles: {particles.aluminumOxide.length} | Total Al Mass: {(atmosphericState.totalAluminumMass / 1000).toFixed(2)} kg
    </p>
  </div>
</div>
```

);
};

export default SatelliteAluminumPollutionModel;
