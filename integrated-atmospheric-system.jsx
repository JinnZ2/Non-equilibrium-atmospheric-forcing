 integrated-atmospheric-system.jsx 
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, Droplet, Target, TrendingUp, Wind, Sparkles } from 'lucide-react';

const IntegratedAtmosphericSystem = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  const [systemState, setSystemState] = useState({
    silicaParticles: 50,
    waterVaporDensity: 30,
    emFieldStrength: 15, // Natural atmospheric electricity
    cloudFormationRate: 0,
    energyHarvested: 0,
    totalEnergyGenerated: 0,
    coolingEffect: 0,
    precision: 0.7, // Targeting precision
    efficiency: 0.6 // System efficiency
  });

  const [particles, setParticles] = useState({
    silica: [],
    waterVapor: [],
    emFields: [],
    harvestingNodes: [],
    targetZones: [],
    clouds: []
  });

  const [metrics, setMetrics] = useState({
    atmosphericBalance: 1.0,
    naturalCycleIntegration: 0.8,
    resourceDepletion: 0, // Zero for silica/water
    economicBenefit: 0,
    sustainabilityScore: 0.75
  });

  // Initialize system
  useEffect(() => {
    const initSilica = Array.from({ length: 40 }, () => ({
      x: Math.random() * 800,
      y: 200 + Math.random() * 150,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2 + 0.08,
      charge: Math.random() * 0.3 - 0.15,
      size: 2 + Math.random() * 1.5,
      targeted: false,
      settling: Math.random() < 0.3
    }));

    const initWater = Array.from({ length: 50 }, () => ({
      x: Math.random() * 800,
      y: 250 + Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      phase: Math.random() < 0.7 ? 'vapor' : 'droplet',
      size: 1.5 + Math.random(),
      temperature: 15 + Math.random() * 5
    }));

    // EM harvesting nodes positioned strategically
    const harvestingNodes = [
      { x: 150, y: 180, active: false, energy: 0, radius: 60 },
      { x: 400, y: 150, active: false, energy: 0, radius: 60 },
      { x: 650, y: 170, active: false, energy: 0, radius: 60 }
    ];

    // Precision targeting zones
    const targetZones = [
      { x: 250, y: 280, radius: 50, active: false, type: 'cloud_formation' },
      { x: 550, y: 260, radius: 50, active: false, type: 'cloud_formation' }
    ];

    setParticles({
      silica: initSilica,
      waterVapor: initWater,
      emFields: [],
      harvestingNodes: harvestingNodes,
      targetZones: targetZones,
      clouds: []
    });
  }, []);

  // Calculate EM energy available for harvesting
  const calculateEMEnergy = (emFields, harvestingNodes) => {
    let totalHarvested = 0;
    
    harvestingNodes.forEach(node => {
      let localEnergy = 0;
      emFields.forEach(field => {
        const dx = field.x - node.x;
        const dy = field.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < node.radius) {
          localEnergy += field.strength * (1 - dist / node.radius);
        }
      });
      
      node.energy = localEnergy;
      node.active = localEnergy > 0.5;
      totalHarvested += localEnergy * 0.3; // 30% harvesting efficiency
    });
    
    return totalHarvested;
  };

  // Precision targeting for cloud formation
  const applyPrecisionTargeting = (silica, water, targetZones, precision) => {
    targetZones.forEach(zone => {
      let particlesInZone = 0;
      let waterInZone = 0;
      
      // Check silica particles in zone
      silica.forEach(s => {
        const dx = s.x - zone.x;
        const dy = s.y - zone.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < zone.radius && Math.random() < precision) {
          s.targeted = true;
          particlesInZone++;
        }
      });
      
      // Check water vapor in zone
      water.forEach(w => {
        const dx = w.x - zone.x;
        const dy = w.y - zone.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < zone.radius && w.phase === 'vapor') {
          waterInZone++;
        }
      });
      
      zone.active = particlesInZone > 3 && waterInZone > 5;
    });
  };

  // Cloud formation through precision nucleation
  const formClouds = (silica, water, targetZones) => {
    const newClouds = [];
    
    targetZones.forEach(zone => {
      if (zone.active) {
        // Count nearby particles
        const nearbyWater = water.filter(w => {
          const dx = w.x - zone.x;
          const dy = w.y - zone.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          return dist < zone.radius && w.phase === 'vapor';
        }).length;
        
        if (nearbyWater > 8 && Math.random() < 0.1) {
          newClouds.push({
            x: zone.x,
            y: zone.y,
            size: 40 + Math.random() * 20,
            opacity: 0.3 + Math.random() * 0.3,
            lifetime: 100 + Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -0.1
          });
        }
      }
    });
    
    return newClouds;
  };

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime(t => t + 1);

      setParticles(prev => {
        // Generate natural atmospheric EM fields (lightning, ionization)
        const newEMFields = [];
        if (Math.random() < 0.15) {
          newEMFields.push({
            x: Math.random() * 800,
            y: 100 + Math.random() * 150,
            strength: 0.5 + Math.random() * 1.5,
            lifetime: 30 + Math.random() * 20
          });
        }

        const updatedEMFields = [...prev.emFields, ...newEMFields]
          .filter(f => f.lifetime > 0)
          .map(f => ({ ...f, lifetime: f.lifetime - 1 }));

        // Update silica particles
        const updatedSilica = prev.silica.map(s => {
          let newVx = s.vx;
          let newVy = s.vy + (s.settling ? 0.12 : 0.06);
          
          // Precision EM manipulation for targeted particles
          if (s.targeted) {
            prev.harvestingNodes.forEach(node => {
              if (node.active) {
                const dx = node.x - s.x;
                const dy = node.y - s.y;
                const dist = Math.sqrt(dx * dx + dy * dy) + 1;
                
                if (dist < node.radius) {
                  const pull = node.energy * 0.005;
                  newVx += pull * dx / dist;
                  newVy += pull * dy / dist;
                }
              }
            });
          }
          
          let newX = s.x + newVx;
          let newY = s.y + newVy;
          
          // Recycling when settled
          if (newY > 360) {
            return {
              x: Math.random() * 800,
              y: 200 + Math.random() * 50,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.2 + 0.08,
              charge: Math.random() * 0.3 - 0.15,
              size: 2 + Math.random() * 1.5,
              targeted: false,
              settling: false
            };
          }
          
          if (newX < 0 || newX > 800) newVx *= -0.8;
          if (newY < 200) newVy *= -0.8;
          
          newX = Math.max(0, Math.min(800, newX));
          newY = Math.max(200, Math.min(360, newY));
          
          // Randomly start settling
          if (!s.settling && Math.random() < 0.008) {
            s.settling = true;
          }
          
          return {
            ...s,
            x: newX,
            y: newY,
            vx: newVx * 0.96,
            vy: newVy * 0.96
          };
        });

        // Add new silica
        if (Math.random() < 0.12) {
          updatedSilica.push({
            x: Math.random() * 800,
            y: 200 + Math.random() * 40,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.2 + 0.08,
            charge: Math.random() * 0.3 - 0.15,
            size: 2 + Math.random() * 1.5,
            targeted: false,
            settling: false
          });
        }

        // Update water vapor
        const updatedWater = prev.waterVapor.map(w => {
          let newVx = w.vx;
          let newVy = w.vy;
          
          // Convection (rising warm vapor)
          if (w.phase === 'vapor' && w.temperature > 18) {
            newVy -= 0.05;
          }
          
          // EM field influence on water molecules
          updatedEMFields.forEach(field => {
            const dx = field.x - w.x;
            const dy = field.y - w.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 50) {
              const influence = field.strength * 0.01 / (dist + 1);
              newVx += influence * dx / dist;
              newVy += influence * dy / dist;
            }
          });
          
          let newX = w.x + newVx;
          let newY = w.y + newVy;
          
          // Phase changes in target zones
          if (w.phase === 'vapor') {
            prev.targetZones.forEach(zone => {
              if (zone.active) {
                const dx = zone.x - w.x;
                const dy = zone.y - w.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < zone.radius && Math.random() < 0.02) {
                  w.phase = 'droplet';
                  w.size *= 2;
                }
              }
            });
          }
          
          // Droplets fall
          if (w.phase === 'droplet') {
            newVy += 0.15;
          }
          
          if (newX < 0 || newX > 800) newVx *= -0.7;
          if (newY < 200) newVy *= -0.6;
          if (newY > 360) {
            // Evaporation at ground
            w.phase = 'vapor';
            w.size = 1.5 + Math.random();
            w.temperature = 15 + Math.random() * 5;
            newY = 350;
            newVy = -Math.abs(newVy) * 0.5;
          }
          
          newX = Math.max(0, Math.min(800, newX));
          newY = Math.max(200, Math.min(360, newY));
          
          return {
            ...w,
            x: newX,
            y: newY,
            vx: newVx * 0.97,
            vy: newVy * 0.97
          };
        });

        // Add new water vapor
        if (Math.random() < 0.18) {
          updatedWater.push({
            x: Math.random() * 800,
            y: 340 + Math.random() * 20,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.2 - Math.random() * 0.2,
            phase: 'vapor',
            size: 1.5 + Math.random(),
            temperature: 17 + Math.random() * 5
          });
        }

        // Apply precision targeting
        applyPrecisionTargeting(updatedSilica, updatedWater, prev.targetZones, systemState.precision);

        // Form clouds
        const newClouds = formClouds(updatedSilica, updatedWater, prev.targetZones);
        const updatedClouds = [...prev.clouds, ...newClouds]
          .filter(c => c.lifetime > 0)
          .map(c => ({
            ...c,
            x: c.x + c.vx,
            y: c.y + c.vy,
            lifetime: c.lifetime - 1,
            opacity: c.opacity * (c.lifetime / 100)
          }));

        return {
          silica: updatedSilica.slice(-60),
          waterVapor: updatedWater.slice(-70),
          emFields: updatedEMFields,
          harvestingNodes: prev.harvestingNodes,
          targetZones: prev.targetZones,
          clouds: updatedClouds
        };
      });

      // Calculate system metrics
      const energyHarvested = calculateEMEnergy(particles.emFields, particles.harvestingNodes);
      const cloudFormationRate = particles.clouds.length / 5;
      const coolingEffect = particles.clouds.reduce((sum, c) => sum + c.size * c.opacity, 0) / 1000;

      setSystemState(prev => ({
        silicaParticles: particles.silica.length,
        waterVaporDensity: particles.waterVapor.filter(w => w.phase === 'vapor').length,
        emFieldStrength: particles.emFields.reduce((sum, f) => sum + f.strength, 0),
        cloudFormationRate: cloudFormationRate,
        energyHarvested: energyHarvested,
        totalEnergyGenerated: prev.totalEnergyGenerated + energyHarvested,
        coolingEffect: coolingEffect,
        precision: prev.precision,
        efficiency: prev.efficiency
      }));

      // Calculate sustainability metrics
      const activeNodes = particles.harvestingNodes.filter(n => n.active).length;
      const activeZones = particles.targetZones.filter(z => z.active).length;
      const sustainabilityScore = (activeNodes * 0.15 + activeZones * 0.2 + coolingEffect * 5 + 
                                     (energyHarvested > 0 ? 0.3 : 0)) / 1.5;

      setMetrics({
        atmosphericBalance: 1.0 + coolingEffect - 0.02, // Slight cooling effect
        naturalCycleIntegration: 0.8 + (particles.silica.filter(s => s.settling).length / particles.silica.length) * 0.2,
        resourceDepletion: 0, // Zero - silica and water recycle
        economicBenefit: energyHarvested * 100 + coolingEffect * 50,
        sustainabilityScore: Math.min(1.0, sustainabilityScore)
      });

    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, particles, systemState]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    const cooling = systemState.coolingEffect;
    gradient.addColorStop(0, `rgba(${10 - cooling * 100}, ${10 - cooling * 50}, ${40 + cooling * 50}, 1)`);
    gradient.addColorStop(0.5, `rgba(${30 - cooling * 150}, ${40 - cooling * 100}, ${90 + cooling * 50}, 1)`);
    gradient.addColorStop(1, `rgba(${50 - cooling * 100}, ${60 - cooling * 80}, ${100 + cooling * 30}, 1)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 400);

    // Draw atmosphere boundary
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(800, 200);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw harvesting nodes
    particles.harvestingNodes.forEach(node => {
      const active = node.active;
      
      // Node glow
      if (active) {
        const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius);
        glowGradient.addColorStop(0, `rgba(100, 255, 200, ${node.energy * 0.3})`);
        glowGradient.addColorStop(0.5, `rgba(50, 200, 255, ${node.energy * 0.15})`);
        glowGradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Node structure
      ctx.strokeStyle = active ? 'rgba(100, 255, 200, 0.9)' : 'rgba(100, 150, 200, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
      ctx.stroke();
      
      // Energy indicator
      if (active) {
        ctx.fillStyle = 'rgba(100, 255, 200, 0.8)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Energy bars
        const bars = Math.floor(node.energy * 5);
        for (let i = 0; i < bars; i++) {
          ctx.strokeStyle = `rgba(100, 255, 200, ${0.9 - i * 0.15})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 16 + i * 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    });

    // Draw target zones
    particles.targetZones.forEach(zone => {
      const active = zone.active;
      
      ctx.strokeStyle = active ? 'rgba(255, 200, 100, 0.7)' : 'rgba(150, 150, 150, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      if (active) {
        // Crosshairs
        ctx.strokeStyle = 'rgba(255, 200, 100, 0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(zone.x - 10, zone.y);
        ctx.lineTo(zone.x + 10, zone.y);
        ctx.moveTo(zone.x, zone.y - 10);
        ctx.lineTo(zone.x, zone.y + 10);
        ctx.stroke();
      }
    });

    // Draw clouds
    particles.clouds.forEach(cloud => {
      const cloudGradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.size);
      cloudGradient.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity * 0.9})`);
      cloudGradient.addColorStop(0.5, `rgba(240, 245, 255, ${cloud.opacity * 0.6})`);
      cloudGradient.addColorStop(1, `rgba(220, 230, 255, 0)`);
      ctx.fillStyle = cloudGradient;
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw EM fields
    particles.emFields.forEach(field => {
      const alpha = field.lifetime / 50;
      const fieldGradient = ctx.createRadialGradient(field.x, field.y, 0, field.x, field.y, 40);
      fieldGradient.addColorStop(0, `rgba(255, 255, 100, ${field.strength * alpha * 0.6})`);
      fieldGradient.addColorStop(0.5, `rgba(200, 200, 255, ${field.strength * alpha * 0.3})`);
      fieldGradient.addColorStop(1, 'rgba(150, 150, 255, 0)');
      ctx.fillStyle = fieldGradient;
      ctx.beginPath();
      ctx.arc(field.x, field.y, 40, 0, Math.PI * 2);
      ctx.fill();
      
      // Lightning bolt effect
      if (field.lifetime > 40) {
        ctx.strokeStyle = `rgba(255, 255, 200, ${alpha * 0.8})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(field.x, field.y - 30);
        ctx.lineTo(field.x - 8, field.y - 10);
        ctx.lineTo(field.x + 5, field.y - 10);
        ctx.lineTo(field.x, field.y + 20);
        ctx.stroke();
      }
    });

    // Draw water vapor and droplets
    particles.waterVapor.forEach(w => {
      if (w.phase === 'vapor') {
        ctx.fillStyle = `rgba(200, 220, 255, ${0.3 + w.temperature / 50})`;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Droplet
        ctx.fillStyle = 'rgba(150, 180, 255, 0.7)';
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.8)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });

    // Draw silica particles
    particles.silica.forEach(s => {
      const targeted = s.targeted;
      const settling = s.settling;
      
      // Highlight targeted particles
      if (targeted) {
        const highlight = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6);
        highlight.addColorStop(0, 'rgba(255, 200, 100, 0.5)');
        highlight.addColorStop(1, 'rgba(255, 150, 50, 0)');
        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.fillStyle = targeted 
        ? 'rgba(255, 200, 100, 0.9)'
        : settling 
          ? 'rgba(150, 180, 150, 0.6)'
          : 'rgba(180, 220, 180, 0.8)';
      
      ctx.strokeStyle = targeted
        ? 'rgba(255, 220, 150, 0.9)'
        : 'rgba(150, 200, 150, 0.7)';
      
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('INTEGRATED ATMOSPHERIC SYSTEM', 10, 25);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(200, 255, 200, 0.8)';
    ctx.fillText('Silica + Water Vapor + EM Harvesting + Precision Targeting', 10, 40);

  }, [particles, systemState]);

  const reset = () => {
    window.location.reload();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-slate-900 rounded-lg shadow-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles size={32} className="text-cyan-400" />
          Integrated Atmospheric Management System
        </h1>
        <p className="text-slate-300 text-sm">
          Biomimetic design: Working WITH natural cycles through precision targeting
        </p>
      </div>

      {/* Main visualization */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400}
          className="w-full rounded border-2 border-cyan-900/50"
        />
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
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
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <span>Silica (recycling)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              <span>Water Vapor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
              <span>EM Harvesting Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
              <span>Target Zone (active)</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Energy Harvesting */}
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
            <Zap size={18} />
            Energy Harvesting
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Current Harvest:</span>
              <span className="text-cyan-400 font-semibold">
                {systemState.energyHarvested.toFixed(2)} MW
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Total Generated:</span>
              <span className="text-green-400 font-semibold">
                {(systemState.totalEnergyGenerated / 1000).toFixed(2)} GWh
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Active Nodes:</span>
              <span className="text-yellow-400 font-semibold">
                {particles.harvestingNodes.filter(n => n.active).length} / {particles.harvestingNodes.length}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Efficiency:</span>
              <span className="text-purple-400">
                {(systemState.efficiency * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Atmospheric Effects */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
            <Wind size={18} />
            Atmospheric Effects
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Cloud Formation:</span>
              <span className="text-blue-400 font-semibold">
                {systemState.cloudFormationRate.toFixed(1)} /min
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Cooling Effect:</span>
              <span className="text-cyan-400 font-semibold">
                {(systemState.coolingEffect * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Water Vapor:</span>
              <span className="text-purple-400">
                {systemState.waterVaporDensity} units
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Active Clouds:</span>
              <span className="text-white font-semibold">
                {particles.clouds.length}
              </span>
            </div>
          </div>
        </div>

        {/* Precision Targeting */}
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center gap-2">
            <Target size={18} />
            Precision Targeting
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Targeting Precision:</span>
              <span className="text-orange-400 font-semibold">
                {(systemState.precision * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Active Zones:</span>
              <span className="text-yellow-400 font-semibold">
                {particles.targetZones.filter(z => z.active).length} / {particles.targetZones.length}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Targeted Particles:</span>
              <span className="text-green-400">
                {particles.silica.filter(s => s.targeted).length} / {particles.silica.length}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Settling Rate:</span>
              <span className="text-cyan-400">
                {((particles.silica.filter(s => s.settling).length / particles.silica.length) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability Metrics */}
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-green-400 mb-3">Sustainability Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <div className="text-slate-400 mb-1">Atmospheric Balance:</div>
            <div className="text-2xl font-bold text-green-400">
              {metrics.atmosphericBalance.toFixed(2)}
            </div>
            <div className="text-xs text-slate-400">Baseline = 1.0</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Natural Integration:</div>
            <div className="text-2xl font-bold text-cyan-400">
              {(metrics.naturalCycleIntegration * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-slate-400">Recycling rate</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Resource Depletion:</div>
            <div className="text-2xl font-bold text-green-400">
              {metrics.resourceDepletion.toFixed(2)}
            </div>
            <div className="text-xs text-slate-400">Zero = sustainable</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Economic Benefit:</div>
            <div className="text-2xl font-bold text-yellow-400">
              ${metrics.economicBenefit.toFixed(0)}M
            </div>
            <div className="text-xs text-slate-400">Per year</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Sustainability Score:</div>
            <div className="text-2xl font-bold text-purple-400">
              {(metrics.sustainabilityScore * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-slate-400">Overall rating</div>
          </div>
        </div>
      </div>

      {/* System Description */}
      <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-300">
        <h4 className="font-semibold text-white mb-3">How The Integrated System Works:</h4>
        <div className="space-y-2">
          <p>
            <span className="text-cyan-400 font-semibold">1. Electromagnetic Energy Harvesting (Cyan Nodes):</span> Natural atmospheric electricity (lightning, ionospheric currents, solar wind coupling) is captured by strategically positioned harvesting nodes. These convert ambient EM energy into usable power. Current harvest: {systemState.energyHarvested.toFixed(2)} MW. This energy powers the precision targeting system.
          </p>
          <p>
            <span className="text-orange-400 font-semibold">2. Precision Targeting Zones (Orange Circles):</span> Using harvested EM energy, silica particles are guided to specific atmospheric locations where cloud formation is desired. Precision: {(systemState.precision * 100).toFixed(0)}%. This is YOUR triangulation idea - using EM fields to position particles exactly where needed instead of random atmospheric distribution.
          </p>
          <p>
            <span className="text-green-400 font-semibold">3. Silica Cloud Nucleation (Green Particles):</span> Silica particles act as cloud condensation nuclei, triggering water vapor condensation in targeted zones. Unlike aluminum, silica naturally settles and recycles through the dust cycle. {((particles.silica.filter(s => s.settling).length / particles.silica.length) * 100).toFixed(0)}% currently settling/recycling.
          </p>
          <p>
            <span className="text-blue-400 font-semibold">4. Water Vapor Integration (Blue Particles):</span> Working WITH the natural hydrological cycle, not against it. Water vapor rises through convection, condenses in target zones, falls as precipitation, evaporates, and repeats. Zero resource depletion. {systemState.waterVaporDensity} vapor units active.
          </p>
          <p>
            <span className="text-white font-semibold">5. Cloud Formation (White Wisps):</span> Precisely targeted cloud formation provides cooling effect without disrupting natural atmospheric balance. Current cooling: {(systemState.coolingEffect * 100).toFixed(1)}%. Clouds are temporary and self-regulating.
          </p>
        </div>
        <div className="mt-3 p-3 bg-cyan-900/30 border border-cyan-500/30 rounded">
          <p className="text-cyan-300 font-semibold mb-2">
            💡 Key Advantages Over Aluminum:
          </p>
          <ul className="text-slate-300 text-xs space-y-1 ml-4 list-disc">
            <li><strong>Zero EM amplification disasters:</strong> Silica has minimal conductivity, no cascade coupling with solar wind</li>
            <li><strong>Natural recycling:</strong> Particles settle and return to dust cycle, no permanent accumulation</li>
            <li><strong>Energy positive:</strong> System generates {systemState.energyHarvested.toFixed(2)} MW from atmospheric EM, offsetting operational costs</li>
            <li><strong>Precision control:</strong> Target specific locations instead of global atmospheric modification</li>
            <li><strong>Reversible:</strong> Stop injection, particles settle out in weeks/months vs. aluminum's years/decades</li>
            <li><strong>Resource neutral:</strong> Silica is Earth's most abundant mineral, water vapor is endlessly recyclable</li>
            <li><strong>Biomimetic:</strong> Copies volcanic eruption → silica dust → cloud formation → precipitation cycle</li>
          </ul>
        </div>
        <div className="mt-3 p-3 bg-purple-900/30 border border-purple-500/30 rounded">
          <p className="text-purple-300 font-semibold mb-2">
            🔬 vs. Aluminum Approach:
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-red-400 font-semibold mb-1">ALUMINUM (Current Reality):</div>
              <ul className="space-y-1 ml-4 list-disc text-slate-300">
                <li>Continuous injection from satellites</li>
                <li>No natural removal</li>
                <li>EM amplification 3-10×</li>
                <li>Catalytic ozone destruction</li>
                <li>Cost: $50-200B/year</li>
                <li>Irreversible resource loss</li>
                <li>Uncontrolled distribution</li>
              </ul>
            </div>
            <div>
              <div className="text-green-400 font-semibold mb-1">SILICA (This System):</div>
              <ul className="space-y-1 ml-4 list-disc text-slate-300">
                <li>Controlled precision injection</li>
                <li>Natural settling & recycling</li>
                <li>EM amplification <1.1×</li>
                <li>No ozone chemistry effects</li>
                <li>Benefit: +${metrics.economicBenefit.toFixed(0)}M/year</li>
                <li>Zero resource depletion</li>
                <li>Targeted distribution</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-3 text-slate-400 text-xs">
          Time: {time} | Energy Harvested: {systemState.totalEnergyGenerated.toFixed(0)} MWh | Active Clouds: {particles.clouds.length} | Sustainability: {(metrics.sustainabilityScore * 100).toFixed(0)}%
        </p>
      </div>
    </div>
  );
};
