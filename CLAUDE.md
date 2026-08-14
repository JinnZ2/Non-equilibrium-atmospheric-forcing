# CLAUDE.md

## Project Overview

**Non-Equilibrium Atmospheric Forcing: A Complexity Economics Analysis**

This repository models the atmospheric effects of aluminum oxide (Al2O3) nanoparticle accumulation from LEO satellite reentry, using complexity economics and electromagnetic coupling physics to predict cascade failures in critical infrastructure (GPS, power grids, electronics).

**Core hypothesis:** Metallic nanoparticles from satellite disposal remain in the stratosphere for ~30 years, increase atmospheric conductivity, and during solar storms create electromagnetic field amplification (3-5x baseline). Economic damages follow power law scaling (Cost ~ Pollution^alpha, alpha ~ 1.5-2.5), with the ~1,000 MT cumulative burden and the Systemic Fragility onset reached at 2040, and Cascade Failure at 2049, under the model's current parameters.

> The hypothesis itself is **untested** in this repo — nothing here measures conductivity, field amplification, or damages. The models assume the coupling law and propagate it. See `RESEARCH_LOG.md` H-00.

## Epistemic Status — read this before citing any number

`RESEARCH_LOG.md` is the authority on which figures in this repo have been re-derived and which are unsourced. Several numbers that appeared in earlier revisions did not reproduce from the models supposed to have produced them (notably the projected time series, H-01, and the "2035-2038" collapse window, H-06, which was five years early). Ten open unknowns are tracked as U-1…U-10.

**Working rules for this repo:**
- Run `python reproduce.py` before quoting a projected figure.
- `coupling_config.json`'s `projected_time_series` is **generated** by `reproduce.py --write`, not hand-authored. Never hand-edit it; change the model and regenerate.
- When a claim is revised, add or update its `RESEARCH_LOG.md` entry with the run that settled it. Don't silently edit numbers.
- Superseded artefacts go to `legacy/` verbatim via `git mv` — never deleted, never tidied on the way in. Precedence carries. See `legacy/README.md`.

## Repository Structure

```
├── Accumulation-with-coupling.py   # Reference model: Al2O3 burden + coupling coefficient (Chi)
├── reproduce.py                    # Regenerates published numbers; re-runs the consistency checks
├── coupling_config.json            # Parameters, risk thresholds, generated projected series
├── Atmospheric-coupling.js         # Agent-based interactive visualization of coupling effects
├── Atmospheric-economics.js        # Economic impact simulation (ozone, agriculture, health, climate)
├── Satellite-pollution-model.js    # Satellite reentry pollution model with economic cost calculations
├── Silica-sim.js                   # Aluminum vs. silica material comparison simulation
├── integrated-atmospheric-system.jsx  # Multi-domain system integrating EM harvesting with atmospheric effects
├── README.md                       # Primary documentation and project overview
├── RESEARCH_LOG.md                 # Claim -> run -> result -> revision; open unknowns
├── CONTRIBUTING.md                 # Contribution guidelines and technical standards
├── Coupling-Physics.md             # Mathematical foundations for EM coupling physics
├── FAQ.md                          # Scientific FAQ addressing skepticism and methodology
├── EXECUTIVE_SUMMARY_STRATEGIC_RISK.md  # Policy-maker brief
├── LICENSE.md                      # MIT License (JinnZ2, 2025)
└── legacy/                         # Superseded artefacts, kept verbatim for precedence
    ├── README.md                       # Precedence record: what was retired, when, why
    ├── Aluminum-loading.py             # Superseded by Accumulation-with-coupling.py (H-08)
    └── coupling_config.2025-12-16.json # Series did not reproduce from the model (H-01, H-05)
```

## Languages and Dependencies

### Python (simulations)
- **NumPy** — numerical computation
- **Matplotlib** — visualization
- Files: `Accumulation-with-coupling.py`, `reproduce.py`

`Accumulation-with-coupling.py` exposes `calculate_coupling_coefficient()` and `run()` behind an `if __name__ == "__main__"` guard, so it can be imported. It is the single source of truth for Chi — do not reimplement the coupling law elsewhere.

### JavaScript / React (interactive visualizations)
- **React** (`useState`, `useEffect`, `useRef`)
- **lucide-react** — icon components
- Files: `Atmospheric-coupling.js`, `Atmospheric-economics.js`, `Satellite-pollution-model.js`, `Silica-sim.js`, `integrated-atmospheric-system.jsx`

> **Note:** There is no `package.json` or `requirements.txt`. Dependencies are implicit via imports.

## Key Domain Concepts

- **Chi (coupling coefficient):** Dimensionless measure of EM coupling strength. Risk regimes: Nominal (<0.5), Incipient (0.5-1.5), Systemic Fragility (1.5-3.0), Cascade Failure (>=3.0). *Cascade was previously documented as >5.0, which left 3.0-5.0 unassigned and disagreed with the model code; resolved in favour of the code — see H-05.*
- **Chi is discontinuous** at burden = 1,000 MT: the piecewise law jumps 1.60x across the branch point. The apparent "phase transition" in the output is that step, not modelled physics (H-04). Left in place deliberately; documented in the function docstring.
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
| Satellite Al content | ~15% of mass (JS) — conflicts with 30 kg Al2O3 per 250 kg satellite (Python) by 5.2x once Al→Al2O3 stoichiometry is applied; see H-03/U-1 |
| Reentry rate baseline | ~730/year (README) vs 500/year (model); unresolved, see U-8 |

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
- Retire, don't delete: `git mv` superseded files into `legacy/` unchanged, then record the retirement in `legacy/README.md` and `RESEARCH_LOG.md`.

### Source file hygiene
Five JS/JSX files were originally committed as chat-transcript pastes and never parsed: curly quotes as string delimiters, stray ` ``` ` fences mid-source, an echoed filename, and an unescaped `<1.1×` read as a JSX tag (H-07). All are repaired. When adding a component, verify it parses before committing:

```bash
npx esbuild --loader:.js=jsx --loader:.jsx=jsx <file> >/dev/null
```

## Build and Run

There is no formal build system. To run:

```bash
pip install numpy matplotlib
python Accumulation-with-coupling.py   # burden + Chi, 20-year projection
python reproduce.py                    # regenerate published numbers, re-run checks
python reproduce.py --write            # also rewrite coupling_config.json's series
```

- **JS/JSX files:** React components meant to be embedded in a React application. Not standalone runnable scripts. They are verified to parse, but have never been rendered and their outputs are unvalidated (U-9).

## No Tests or CI

This project has no test suite or CI/CD pipeline. `reproduce.py` is the closest thing to a regression check — it re-derives the published figures from the model, so a silent drift between the two shows up as a diff. Contributions adding real validation or testing infrastructure are welcome; a harness that renders the React models (U-9) would be the highest-value addition.
