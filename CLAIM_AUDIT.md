# Claim Audit Protocol

**How to read a headline number — including this repo's own.**

A checklist for the question *"is this quantity what it appears to be?"* Every
check below has already caught at least one documented error **in this
repository**, which is the argument for it: it is not a hypothetical protocol,
it is a retrospective description of how this project has actually gone wrong.

Framework contributed by the repo author, 2026-08-21. Generalised here and
cross-referenced to `RESEARCH_LOG.md` and `STRUCTURAL_LIMITS.md`.

---

## 1. Baseline choice

**Which reference period?** 1991–2020 vs 1951–1980 vs pre-industrial changes an
anomaly's magnitude substantially. A *smaller* anomaly number may just be a
later baseline that has absorbed prior change into the "normal".

> A rolling baseline makes a monotonic trend look like a series of unremarkable
> excursions. Each one is small against its own recent past.

**Caught here:**
- **H-01** — the published series was the model's own output displaced five
  years. A baseline offset, propagated into every headline date.
- **H-15** — the natural:satellite ratio quoted as 18× is a *2025 snapshot* of a
  quantity growing 15 %/yr against a constant one. Crossover ~2046. A trajectory
  described by one of its early points.

## 2. Depth / dimension exclusion

**Surface-only vs full-column.** If a dimension is excluded from the
measurement, anomalies living in that dimension do not appear in the headline —
regardless of size.

**Caught here, and this one is structural:**
- **S-1** — the burden model is a single global scalar with **no altitude
  coordinate**. It is the exact analogue of a surface-only ocean measurement.
  Ferreira's Al₂O₃ "descending from the mesosphere into the ozone layer" is a
  *trajectory through a dimension this model does not have*.
- **H-09** — Al₂O₃ is 1 of 13 known species. The other 12 are excluded from
  every number the project publishes.
- **H-11** — reentry is 1 of 2 emission pathways. Launch exhaust is excluded
  entirely, and it deposits the same species.

## 3. Spatial averaging

**A regional anomaly is diluted by global averaging.** An annular or banded
pattern can nearly vanish in a global mean while being severe everywhere it
actually is.

**Caught here:** S-1 again. The repo does not merely risk this error — it is
built on it. Burden is *defined* as a global scalar, so every regional
structure is averaged away before any calculation begins.

## 4. What is "not that bad" being compared to?

Against worst-case projections, perhaps. Against a pre-industrial baseline, no.
**Name the comparator, because that is where the reassurance is stored.**

**Caught here:**
- **H-02** — 450 t/yr was published as a present-day rate. It was the
  full-deployment projection from the same document's own table. Wrong by ~26×,
  purely from comparing against the wrong scenario.
- **H-06** — "Year of Collapse 2035–2038" was a faithful reading of a series
  that did not reproduce. The comparator was wrong, not the arithmetic.

## 5. The unstated subject

**The paper measures one variable. The headline implies a category.** The
substitution is where the reassurance comes from.

Worked example — the 2026 Utrecht AMOC study:

| | Quantity |
|---|---|
| What the paper measures | AMOC circulation continuity — one subsystem, one variable |
| What the headline implies | ocean systems generally, biosphere tolerance, human consequence |

Same ocean state, different subject:

- **AMOC** — may persist under slower forcing
- **coral** — already past bleaching thresholds
- **upwelling** — suppressed under a warm surface lens
- **fisheries** — stratification blocks nutrient flux
- **subsurface heat** — no mechanism in an AMOC model reads it

"Handles it" is **true for the modelled variable and false for nearly every
coupled one.**

**Caught here — twice, and one of them was mine:**
- **H-15** — the natural meteoric background was written up as a counter-argument
  to the thesis. The question was *conductivity*; the answer given was *bulk mass
  fraction*. Wrong subject. Mass fraction is not the metric for a doped-population
  conductivity question at all.
- **H-12** — the repo modelled Al₂O₃ → ozone as direct catalysis. The actual
  subject is chlorine activation, with Al₂O₃ as an unconsumed surface. Modelling
  the wrong reactant produces a rate law that cannot be right even with perfect
  parameters.

## 6. Level or derivative?

**Is the stated condition a threshold on a level, or on a rate of change?** They
are not interchangeable, and conflating them inverts conclusions.

The Utrecht AMOC result is the clean case. van Westen et al. (*Nature Climate
Change*, 2026) find **rate-induced tipping**: a slow CO₂ ramp (+0.5 ppm/yr)
leaves the AMOC stable past **+5.5 °C**, while faster ramps collapse it at
**+2 °C**. In the lead author's words, *"there is not necessarily a fixed
temperature beyond which the AMOC inevitably collapses."*

So there is **no safe temperature number.** The collapse condition is a
derivative. The reassuring headline — "handles more warming than expected" —
holds only for the slow-ramp case, which is not the observed condition. The
subtitle's "one big catch" *is* the finding.

**Caught here:** **S-15**, newly opened. This repo's own threshold is a
**level** — 1,000 MT — with no rate term anywhere. χ = f(burden), full stop.

Why it matters, computed:

| | Constant 15 %/yr | Surge to 2035, then saturate |
|---|---|---|
| Burden 2040 | 687 MT | 1,510 MT |
| Burden 2080 | 184,012 MT | **1,510 MT (plateau)** |
| dB/dt 2035 | 45 MT/yr | **221 MT/yr (peak)** |
| dB/dt 2080 | 24,002 MT/yr | **~0** |
| Model verdict 2080 | Cascade | **"Systemic Fragility" — forever** |

Under constant exponential growth, level and rate are degenerate: dB/dt ÷ B
holds at 0.130 throughout, so the distinction is invisible and nothing is lost.
**It bites exactly when the growth rate changes** — which is the realistic
deployment case, since constellations deploy and then saturate.

On that trajectory a level model says risk is permanently maxed; a rate model
says risk peaked during deployment and then fell as the system re-equilibrated.
**Opposite qualitative predictions from one trajectory**, and this model cannot
express the second.

---

## Instrument-record discontinuities

Distinct hazard class: the record itself changes underneath the quantity.

| Transition | What changed |
|---|---|
| Bucket → engine-intake SST | Known warm bias introduced, then corrected *differently by different groups* |
| XBT → Argo | Depth coverage, spatial coverage and temporal resolution changed **simultaneously** — three confounds at once |
| Satellite era onset | Surface-only, different spatial resolution than in-situ, different quantity being averaged |
| Argo depth range | 0–2000 m standard; check whether a given stratum was sampled *consistently across the full record*, not just whether it is nominally in range |

The last is the subtle one: a depth being *within* an instrument's range does
not mean it was sampled uniformly over the record's whole length.

**This repo's exposure:** total, and by omission. There is no instrument-record
awareness anywhere, and **S-12** records why that cannot currently be fixed —
backward horizon zero. You cannot detect a discontinuity in a record you do not
have.

---

## Using it

Run through 1–6 before quoting any external figure, and before publishing any of
this repo's own. The protocol earns its place by having caught H-01, H-02, H-06,
H-09, H-11, H-12, H-15 and S-1 — every one already documented, none hypothetical.

The uncomfortable result: **a checklist built to audit outside literature
catches this project's own published numbers at the same rate.** That is the
finding worth keeping.
