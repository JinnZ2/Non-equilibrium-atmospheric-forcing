# CLAUDE.md

## Project Overview

**Non-Equilibrium Atmospheric Forcing: A Complexity Economics Analysis**

This repository models the atmospheric effects of aluminum oxide (Al2O3) nanoparticle accumulation from LEO satellite reentry, using complexity economics and electromagnetic coupling physics to predict cascade failures in critical infrastructure (GPS, power grids, electronics).

**Core hypothesis:** Metallic nanoparticles from satellite disposal remain in the mesosphere/stratosphere for ~5 years (range 3-10; corrected from an earlier 30-year estimate, though that correction is itself contested — see H-13), increase atmospheric conductivity, and during solar storms may create electromagnetic field amplification (5-20% typical, up to 1.5-3x in extreme events). Economic damages may follow power law scaling (Cost ~ Pollution^alpha, alpha ~ 1.5-2.5), with potential threshold effects at ~1,000 MT cumulative burden — reached at **2043** under the model's current parameters, with Pre-Cascade at 2054.

> The hypothesis itself is **untested** in this repo — nothing here measures conductivity, field amplification, or damages. The models assume the coupling law and propagate it. See `RESEARCH_LOG.md` H-00.

## Epistemic Status — read this before citing any number

**Two registers.** `RESEARCH_LOG.md` tracks *parametric* unknowns (U-1…U-22): we don't know this number. `STRUCTURAL_LIMITS.md` tracks *structural* ones (S-1…S-14): the model has no variable for this, and no parameter value fixes it. The repo's parametric hygiene is now good and its structural limits are largely untouched — don't mistake the first for the second (H-18).

`RESEARCH_LOG.md` is the authority on which figures in this repo have been re-derived and which are unsourced. Several numbers that appeared in earlier revisions did not reproduce from the models supposed to have produced them — **twice, independently** (H-01 and H-14). Open unknowns are tracked as U-1…U-22.

**Working rules for this repo:**
- Run `python reproduce.py` before quoting a projected figure.
- **Never invent a coupling weight or a flux to make a calculation runnable.** `species_inventory.json` uses explicit `status` fields (`sourced` / `repo_assumption` / `unquantified` / `speculative`); leave a field `null` with status `unquantified` rather than filling it. `Multi-species-accumulation.py` deliberately refuses to produce a combined Chi for this reason — the blank is the finding (U-11, U-12).
- Al2O3 is 1 of 13 known species and reentry is 1 of 2 pathways. Don't write "total atmospheric burden" when you mean Al2O3-from-reentry (H-09, H-11).
- **The models carry no interannual variability** — no ENSO, no QBO, no seasonality (H-17). A very strong El Nino is running through 2026-27; the model puts chi at ~0.003 for that window, ~72x below its lowest regime, so it rules out satellite attribution for anything observed there. Don't let a natural event be read as confirmation.
- ENSO figures in `enso_state.json` are revised monthly and go stale fast. Re-check before quoting (U-20).
- `coupling_config.json`'s `projected_time_series` is **generated** by `reproduce.py --write`, not hand-authored. Never hand-edit it; change the model and regenerate.
- When a claim is revised, add or update its `RESEARCH_LOG.md` entry with the run that settled it. Don't silently edit numbers.
- **Two mechanisms in the README are challenged and unrebutted (H-19).** The "conductive mesh" is ~13 orders of magnitude short of percolation at every burden projected here, and the established ion-aerosol result is that aerosol loading *lowers* conductivity — the opposite sign to this repo's premise. Don't restate either mechanism as settled.
- **The forcing is not unprecedented; the exposure is (H-20).** Nearby supernovae delivered ~100x cosmic rays for centuries and the atmosphere showed *compensating* effects; Laschamp took the field to ~10% of modern for ~2,000 years with bounded, recovered consequences. Don't write "unprecedented forcing" — write "ordinary forcing, unprecedented vulnerability", which survives the record.
- The models have **zero** damping, recovery or saturation terms (S-13). They can only amplify. Don't add another amplifying term without saying why there is no stabilising one.
- There is no coupling in the coupling model: Chi takes two scalars, and Chemical/Geomagnetic/Orbital reference it zero times (H-18, S-5). If you add a domain module, wire it to Chi or don't call it coupling.
- Superseded artefacts go to `legacy/` verbatim via `git mv` — never deleted, never tidied on the way in. Precedence carries. See `legacy/README.md`.

## Repository Structure

```
├── Accumulation-with-coupling.py   # Reference model: Al2O3 burden + coupling coefficient (Chi)
├── Multi-species-accumulation.py   # All 13 species, both emission pathways; reports coverage gaps
├── Chemical-interactions.py        # Heterogeneous chemistry: Al2O3 catalysis, SAI synergy, EPP-NOx
├── Geomagnetic-dynamics.py         # Magnetic field evolution, SAA growth, geomagnetic jerks, EPP coupling
├── Orbital-coupling.py             # Cometary dust, close passes, solar cycle, heliospheric geometry
├── ENSO-coupling.py                # Current El Nino state; attribution guard for the 2026-27 window
├── Structural-audit.py             # Machine-checks what the model's FORM cannot represent (S-register)
├── reproduce.py                    # Regenerates published numbers; re-runs the consistency checks
├── coupling_config.json            # Parameters, risk thresholds, generated projected series
├── species_inventory.json          # Species across reentry + launch pathways, with per-field epistemic status
├── enso_state.json                 # Current ENSO figures + coupling mechanisms, with per-field status
├── SPECIES.md                      # Narrative: pathways, the chlorine coupling, industry proposals
├── STRUCTURAL_LIMITS.md            # S-1..S-14: model-form limits no parameter value can fix
├── DEEP_TIME.md                    # Paleo natural experiments: the constraint data the repo never used
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
- Files: `Accumulation-with-coupling.py`, `Multi-species-accumulation.py`, `Chemical-interactions.py`, `Geomagnetic-dynamics.py`, `Orbital-coupling.py`, `ENSO-coupling.py`, `Structural-audit.py`, `reproduce.py`

`Accumulation-with-coupling.py` exposes `calculate_coupling_coefficient()`, `risk_level()` and `run()` behind an `if __name__ == "__main__"` guard, so it can be imported. It is the single source of truth for Chi — do not reimplement the coupling law elsewhere.

### JavaScript / React (interactive visualizations)
- **React** (`useState`, `useEffect`, `useRef`)
- **lucide-react** — icon components
- Files: `Atmospheric-coupling.js`, `Atmospheric-economics.js`, `Satellite-pollution-model.js`, `Silica-sim.js`, `integrated-atmospheric-system.jsx`

> **Note:** There is no `package.json` or `requirements.txt`. Dependencies are implicit via imports.

## Key Domain Concepts

- **Chi (coupling coefficient):** Dimensionless measure of EM coupling strength. Risk regimes: Nominal (<0.5), Incipient (0.5-1.5), Systemic Fragility (1.5-3.0), **Pre-Cascade (3.0-5.0)**, Cascade Failure (>5.0). *The Pre-Cascade band exists because the config set cascade at 5.0 while the code labelled it at 3.0, leaving 3.0-5.0 unassigned — see H-05.*
- **Chi is discontinuous** at burden = 1,000 MT: the piecewise law jumps 1.60x across the branch point. The apparent "phase transition" in the output is that step, not modelled physics (H-04). Left in place deliberately; documented in the function docstring.
- **A_field:** EM field amplification factor. Significant effects above A_field > 1.5 (revised from 3.0; see corrected coupling efficiency)
- **Power law scaling:** Economic damages scale nonlinearly — traditional linear models may underestimate by 2-10x (revised from 10-40x)
- **LOGOS framework:** Multi-domain dependency mapping across atmospheric, economic, and logistics systems
- **Regime transitions:** Stable -> Degraded -> Critical -> Cascade

## Key Parameters (from `coupling_config.json`)

| Parameter | Value |
|-----------|-------|
| Al2O3 residence time | ~5 years (range 3-10; corrected from 30) — **contested**, Ferreira 2024 implies up to 30; see H-13 |
| Critical mass threshold | 1,000 MT (speculative, no observational constraint — U-2) |
| Coupling resonance | Removed (previous 100 MHz was incorrect by ~5 orders of magnitude — closes U-4) |
| Al2O3 yield per satellite | 30 kg per 250 kg satellite (**sourced**: Ferreira et al. 2024 — closes U-1) |
| Satellite Al content | ~15% of mass (JS) — conflicts with the 30 kg/250 kg figure by 5.2x once Al→Al2O3 stoichiometry is applied; see H-03/U-12 |
| Reentry rate baseline | ~730/year (standardised across Python files) |
| Growth rate | 15%/year (unsourced — U-8) |

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
- Retire, don't delete: `git mv` superseded files into `legacy/` unchanged, then record the retirement in `legacy/README.md` and `RESEARCH_LOG.md`.

### Source file hygiene
Five JS/JSX files were originally committed as chat-transcript pastes and never parsed: curly quotes as string delimiters, stray ` ``` ` fences mid-source, an echoed filename, and an unescaped `<1.1×` read as a JSX tag (H-07). All are repaired. When adding a component, verify it parses before committing:

```bash
npx esbuild --loader:.js=jsx --loader:.jsx=jsx <file> >/dev/null
```

## Build and Run

There is no formal build system. To run:

```bash
pip install numpy
python Accumulation-with-coupling.py   # burden + Chi, 20-year projection
python Multi-species-accumulation.py   # all 13 species, both pathways, coverage gaps
python ENSO-coupling.py                # ENSO state, attribution guard, residence sensitivity
python Structural-audit.py             # what the model's form cannot represent
python reproduce.py                    # regenerate published numbers, re-run checks
python reproduce.py --write            # also rewrite coupling_config.json's series
```

- **JS/JSX files:** React components meant to be embedded in a React application. Not standalone runnable scripts. They are verified to parse, but have never been rendered and their outputs are unvalidated (U-9).

## No Tests or CI

This project has no test suite or CI/CD pipeline. `reproduce.py` is the closest thing to a regression check — it re-derives the published figures from the model, so a silent drift between the two shows up as a diff. Contributions adding real validation or testing infrastructure are welcome; a harness that renders the React models (U-9) would be the highest-value addition.

## Known Limitations

- **`coupling_config.json` is only partly wired in.** `reproduce.py` generates its series and `Multi-species-accumulation.py` reads `species_inventory.json`, but the other Python files and all JS files still hardcode their own parameter copies. The config is canonical for the generated series only; elsewhere it remains documentation.
- **JS simulations use qualitative approximations** of the equations in `Coupling-Physics.md`, not exact implementations. Coulomb forces use visualization-scaled constants rather than the physical Coulomb constant k.
- **Several documented equations are not implemented:** solar wind flux, magnetic shielding, coupling efficiency, full A_field formula (Coupling-Physics.md sections 2.1-2.3, 3.1). The power-law damage function in section 5.1 is also unimplemented — no code produces the headline economic figure (U-5, U-10).
- **No shared constants module** — most files define their own copies of physical constants. `Accumulation-with-coupling.py` is the exception and is the single source of truth for Chi.
- **React simulation pattern:** All JS components use `setInterval` inside `useEffect` with state in the dependency array, meaning the interval is recreated each tick. Functional but not performance-optimal for large particle counts.
