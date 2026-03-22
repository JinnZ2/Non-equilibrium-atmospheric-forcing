# CLAUDE.md

## Project Overview

**Non-Equilibrium Atmospheric Forcing: A Complexity Economics Analysis**

This repository models the atmospheric effects of aluminum oxide (Al2O3) nanoparticle accumulation from LEO satellite reentry, using complexity economics and electromagnetic coupling physics to predict cascade failures in critical infrastructure (GPS, power grids, electronics).

**Core hypothesis:** Metallic nanoparticles from satellite disposal remain in the stratosphere for ~30 years, increase atmospheric conductivity, and during solar storms create electromagnetic field amplification (3-5x baseline). Economic damages follow power law scaling (Cost ~ Pollution^alpha, alpha ~ 1.5-2.5), with a critical cascade threshold projected for 2035-2038 at ~1,000 MT cumulative burden.

## Repository Structure

All files live at the root level — there are no subdirectories.

```
├── Accumulation-with-coupling.py   # EM coupling coefficient calculator (Chi), 20-year forecast
├── Aluminum-loading.py             # Al2O3 accumulation simulator (injection rates, atmospheric burden)
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
- **Matplotlib** — visualization
- Files: `Accumulation-with-coupling.py`, `Aluminum-loading.py`

### JavaScript / React (interactive visualizations)
- **React** (`useState`, `useEffect`, `useRef`)
- **lucide-react** — icon components
- Files: `Atmospheric-coupling.js`, `Atmospheric-economics.js`, `Satellite-pollution-model.js`, `Silica-sim.js`, `integrated-atmospheric-system.jsx`

> **Note:** There is no `package.json` or `requirements.txt`. Dependencies are implicit via imports.

## Key Domain Concepts

- **Chi (coupling coefficient):** Dimensionless measure of EM coupling strength. Risk regimes: Nominal (<0.5), Incipient (0.5-1.5), Systemic Fragility (1.5-3.0), Cascade Failure (>5.0)
- **A_field:** EM field amplification factor. Cascade threshold at A_field > 3.0
- **Power law scaling:** Economic damages scale nonlinearly — traditional linear models underestimate by 10-40x
- **LOGOS framework:** Multi-domain dependency mapping across atmospheric, economic, and logistics systems
- **Regime transitions:** Stable -> Degraded -> Critical -> Cascade

## Key Parameters (from `coupling_config.json`)

| Parameter | Value |
|-----------|-------|
| Al2O3 residence time | 30 years |
| Critical mass threshold | 1,000 MT |
| Coupling resonance | 100 MHz |
| Satellite Al content | ~15% of mass |
| Reentry rate baseline | ~730/year |

## Development Conventions

### Code Style
- **Python:** Standard scientific Python style. Use NumPy for numerical work.
- **JavaScript/JSX:** React functional components with hooks. Interactive visualizations use `requestAnimationFrame` for animation loops.
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

- **Python scripts:** `python Accumulation-with-coupling.py` or `python Aluminum-loading.py` (requires NumPy, Matplotlib)
- **JS/JSX files:** These are React components meant to be embedded in a React application. They are not standalone runnable scripts.

## No Tests or CI

This project currently has no test suite or CI/CD pipeline. Contributions adding validation or testing infrastructure are welcome.
