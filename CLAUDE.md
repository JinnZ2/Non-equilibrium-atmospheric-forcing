# CLAUDE.md

## Project Overview

**Non-Equilibrium Atmospheric Forcing: A Complexity Economics Analysis**

This repository models the atmospheric effects of aluminum oxide (Al2O3) nanoparticle accumulation from LEO satellite reentry, using complexity economics and electromagnetic coupling physics to predict cascade failures in critical infrastructure (GPS, power grids, electronics).

**Core hypothesis:** Metallic nanoparticles from satellite disposal remain in the mesosphere/stratosphere for ~5 years (range 3-10; corrected from earlier 30-year estimate), increase atmospheric conductivity, and during solar storms may create electromagnetic field amplification (5-20% typical, up to 1.5-3x in extreme events). Economic damages may follow power law scaling (Cost ~ Pollution^alpha, alpha ~ 1.5-2.5), with potential threshold effects at ~1,000 MT cumulative burden (timeline pushed to ~2045-2055 with corrected residence time).

## Repository Structure

All files live at the root level — there are no subdirectories.

```
├── Accumulation-with-coupling.py   # EM coupling coefficient calculator (Chi), 20-year forecast
├── Aluminum-loading.py             # Al2O3 accumulation simulator (injection rates, atmospheric burden)
├── Chemical-interactions.py        # Heterogeneous chemistry: Al2O3 catalysis, SAI synergy, EPP-NOx
├── Geomagnetic-dynamics.py         # Magnetic field evolution, SAA growth, geomagnetic jerks, EPP coupling
├── Orbital-coupling.py             # Cometary dust, close passes, solar cycle, heliospheric geometry
├── Atmospheric-coupling.js         # Agent-based interactive visualization of coupling effects
├── Atmospheric-economics.js        # Economic impact simulation (ozone, agriculture, health, climate)
├── Satellite-pollution-model.js    # Satellite reentry pollution model with economic cost calculations
├── Silica-sim.js                   # Aluminum vs. silica material comparison simulation
├── integrated-atmospheric-system.jsx  # Multi-domain system integrating EM harvesting with atmospheric effects
├── coupling_config.json            # Simulation parameters, risk thresholds, projected time series
├── README.md                       # Primary documentation and project overview
├── CONTRIBUTING.md                 # Contribution guidelines and technical standards
├── Coupling-Physics.md             # Mathematical foundations for EM coupling physics
├── FAQ.md                          # Scientific FAQ addressing skepticism and methodology
├── EXECUTIVE_SUMMARY_STRATEGIC_RISK.md  # Policy-maker brief
└── LICENSE.md                      # MIT License (JinnZ2, 2025)
```

## Languages and Dependencies

### Python (simulations)
- **NumPy** — numerical computation
- Files: `Accumulation-with-coupling.py`, `Aluminum-loading.py`, `Chemical-interactions.py`, `Geomagnetic-dynamics.py`, `Orbital-coupling.py`

### JavaScript / React (interactive visualizations)
- **React** (`useState`, `useEffect`, `useRef`)
- **lucide-react** — icon components
- Files: `Atmospheric-coupling.js`, `Atmospheric-economics.js`, `Satellite-pollution-model.js`, `Silica-sim.js`, `integrated-atmospheric-system.jsx`

> **Note:** There is no `package.json` or `requirements.txt`. Dependencies are implicit via imports.

## Key Domain Concepts

- **Chi (coupling coefficient):** Dimensionless measure of EM coupling strength. Risk regimes: Nominal (<0.5), Incipient (0.5-1.5), Systemic Fragility (1.5-3.0), Cascade Failure (>5.0)
- **A_field:** EM field amplification factor. Significant effects above A_field > 1.5 (revised from 3.0; see corrected coupling efficiency)
- **Power law scaling:** Economic damages scale nonlinearly — traditional linear models may underestimate by 2-10x (revised from 10-40x)
- **LOGOS framework:** Multi-domain dependency mapping across atmospheric, economic, and logistics systems
- **Regime transitions:** Stable -> Degraded -> Critical -> Cascade

## Key Parameters (from `coupling_config.json`)

| Parameter | Value |
|-----------|-------|
| Al2O3 residence time | ~5 years (range 3-10; corrected from 30) |
| Critical mass threshold | 1,000 MT (speculative) |
| Coupling resonance | Removed (previous 100 MHz was incorrect by ~5 orders of magnitude) |
| Satellite Al content | ~15% of mass |
| Reentry rate baseline | ~730/year |

## Development Conventions

### Code Style
- **Python:** Standard scientific Python style. Use NumPy for numerical work.
- **JavaScript/JSX:** React functional components with hooks. Simulations use `setInterval` (50ms) inside `useEffect` for animation loops.
- Filenames use **Title-Case-with-hyphens** (e.g., `Atmospheric-coupling.js`).

### Contributing Guidelines (from CONTRIBUTING.md)
- **Do not smooth or normalize data** to hide nonlinearities — preserve raw coupling effects.
- Contributions welcome in: MHD refinement, chemical kinetics, logistics stress-testing, economic exponents.
- Anonymous/pseudonymous contributions encouraged.
- TypeScript/React submissions should include prop types and unit-aware calculations.
- Python submissions should include uncertainty bounds.

### Git Practices
- Branch from `main` for new work.
- Commit messages are descriptive and action-oriented (e.g., "Create Atmospheric-coupling.js").
- No CI/CD or automated tests currently exist.

## Build and Run

There is no formal build system. To run:

- **Python scripts:** `python Accumulation-with-coupling.py` or `python Aluminum-loading.py` (requires NumPy)
- **JS/JSX files:** These are React components meant to be embedded in a React application. They are not standalone runnable scripts.

## No Tests or CI

This project currently has no test suite or CI/CD pipeline. Contributions adding validation or testing infrastructure are welcome.

## Known Limitations

- **`coupling_config.json` is not imported by any code file.** All parameters are hardcoded in each file independently. The config file serves as documentation of canonical values.
- **JS simulations use qualitative approximations** of the equations in `Coupling-Physics.md`, not exact implementations. Coulomb forces use visualization-scaled constants rather than physical Coulomb constant k.
- **Several documented equations are not yet implemented:** solar wind flux, magnetic shielding, coupling efficiency, full A_field formula (see Coupling-Physics.md sections 2.1-2.3, 3.1).
- **No shared constants module** — each file defines its own copies of physical constants.
- **React simulation pattern:** All JS components use `setInterval` inside `useEffect` with state in the dependency array, meaning the interval is recreated each tick. This is functional but not performance-optimal for large particle counts.
