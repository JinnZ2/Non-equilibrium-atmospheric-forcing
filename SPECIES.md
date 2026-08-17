# Species Inventory: What Actually Goes Up There

This project began as an Al₂O₃ model. Aluminium oxide is one species out of
more than twenty, arriving by two pathways, only one of which this repo models.

Data: [`species_inventory.json`](species_inventory.json) ·
Model: `python Multi-species-accumulation.py` ·
Provenance: [`RESEARCH_LOG.md`](RESEARCH_LOG.md) H-09 … H-12

> **Verification status.** The citations here were gathered by web search on
> 2026-08-14. Publisher domains were blocked by this environment's network
> egress policy, so **abstracts and secondary summaries were the sources, not
> the full papers.** Every reference is marked `verified_against_primary: false`.
> Check them before citing. Tracked as U-14 — it is the first item on the
> next-runs list.

---

## The headline number

**1 of 13.** Thirteen species are known to be present. This repo can put a flux
figure on one of them.

```
13 species tracked | 1 with a flux estimate | 12 unquantified
Coverage: 8%
```

That is the result of this round. Not a projection — a coverage gap.

---

## Two pathways, not one

The repo models satellite reentry ablation. There is a second pathway, and it
deposits some of the same species.

| | Reentry ablation | Launch exhaust |
|---|---|---|
| **Source** | Satellites burning up on descent | Rocket motors on ascent |
| **Modelled here?** | Yes | **No** |
| **Species in inventory** | 7 | 4 (+1 on both) |
| **Quantified** | 1 | **0** |
| **Key species** | Al₂O₃, Li, Cu, Pb, Nb, Hf | Alumina, HCl, black carbon, NOx, H₂O |

Solid rocket motors burn aluminium fuel with an ammonium perchlorate oxidiser.
They emit **alumina — chemically identical to the reentry product** — plus
hydrogen chloride.

**Consequence:** every total-Al₂O₃ burden figure this repo publishes is an
undercount, by an unknown margin. (H-11)

---

## What is up there

### Detected, attributed to spacecraft (Murphy et al. 2023, PNAS)

Over **20 elements**, in ratios matching spacecraft alloys.

| Species | Origin | What is established |
|---|---|---|
| **Al₂O₃** | Structural airframe | ~17 MT/yr (2022); the only quantified species here |
| **Lithium** | Batteries | Reentry mass **exceeds cosmic dust influx** |
| **Copper** | Wiring, coils, reaction wheels | Reentry mass **exceeds cosmic dust influx** |
| **Lead** | Solder, shielding | Reentry mass **exceeds cosmic dust influx** |
| **Niobium** | Superalloys | Attribution tracer — see below |
| **Hafnium** | High-temp components | Attribution tracer — see below |
| *~14+ others* | Spacecraft alloys | Detected, not enumerated in our sources (U-11) |

Two findings deserve to be pulled out:

**The space industry has overtaken the natural source.** For lithium, aluminium,
copper and lead, reentry mass now exceeds the cosmic dust influx of that same
metal. Not a trace contribution — the dominant one.

**Niobium and hafnium settle the attribution argument.** Neither occurs as a
free element in nature; both must be refined from ore. Finding them in
stratospheric aerosol is unambiguous spacecraft origin, with no meteoric
confound available as an alternative explanation. This is why the 2023 result
counts as a detection rather than a correlation.

Current reach: **~10%** of stratospheric sulfuric acid particles above 120 nm
contain spacecraft-reentry metals. Projected to approach **~50%** with planned
constellation growth — comparable to the fraction that now contains meteoric
metals.

### Launch exhaust

| Species | Mechanism | Status here |
|---|---|---|
| **Alumina** | Same Al₂O₃, second pathway | Unquantified |
| **HCl / reactive chlorine** | Ammonium perchlorate oxidiser | Unquantified — **the critical gap** |
| **Black carbon** | Hydrocarbon propellants | Unquantified; radiative, unmodelled mechanism |
| **NOx** | Shock heating (both pathways) | Unquantified |
| **H₂O** | Hydrolox / methalox | Unquantified |

---

## The chlorine coupling

This is the most consequential thing found in this round.

The repo's `Coupling-Physics.md` §4 models Al₂O₃ as destroying ozone directly.
It does not. Per Ferreira et al. (2024):

> Aluminium oxides **do not react with ozone**. They activate **chlorine**,
> which does the destroying. The alumina is **not consumed**, so a single
> particle keeps catalysing for decades as it settles.

Two things follow, and the second is the one that matters for a project about
coupling:

1. **Al₂O₃ is a catalyst surface, not a reactant.** Its effect is bounded by
   available chlorine, not by its own quantity. Doubling alumina against fixed
   chlorine is not the same as doubling both.

2. **Reentry and launch are not independent problems.** Chlorine comes largely
   from solid rocket motors — the *launch* pathway. So the ozone impact of the
   *reentry* pathway is co-limited by a species this repo does not model, emitted
   by a pathway this repo does not model.

For a project whose entire thesis is that institutional models fail by treating
coupled systems as separate silos, this is an uncomfortable finding: the repo
was doing the same thing. It is recorded as H-12 rather than quietly patched.

**Unresolved tension (U-13).** The retrieved chlorine sensitivity is *modest* —
a 10× increase in rocket chlorine over 2019 gives <0.1 DU (0.04%) near-global
column ozone loss; 52× gives 0.6 DU (0.23%). Those numbers are far smaller than
this repo's ozone rhetoric implies. Either the repo's claims are overstated or
they rest on a mechanism the cited work does not cover. That should be settled,
not left ambiguous — it is the claim a policymaker would act on.

---

## The "new" things

Proposals and rules that change the inventory. None is modelled here; each is a
hypothesis with a sign that has not been checked.

### Design for Demise

Debris-mitigation practice: build satellites to burn up **more completely** on
reentry, so nothing survives to hit the ground.

It works on the problem it targets, and its mechanism of action is *increasing
ablation* — which is precisely the process that produces the nanoparticles. A
policy that succeeds at ground-casualty risk may, by construction, increase
atmospheric injection per satellite. **The sign is knowable and nobody here has
checked it.** (U-16)

### The 5-year deorbit rule

Shortening the post-mission disposal deadline reduces collision risk and orbital
crowding. It also shortens satellite lifetimes, and reentries per year is
lifetime-dependent: the same constellation cycled faster reenters more often.
Debris policy is an input to the injection rate. (U-16)

### Constellation scale-up

On the order of 50,000 additional satellites projected in orbit by 2030. This is
the driver behind the ~10% → ~50% particle-fraction projection, and behind
Ferreira's >360 MT/yr mega-constellation scenario against ~17 MT/yr in 2022 — a
**more than twentyfold** increase in Al₂O₃ injection.

### Propellant substitution

Changing propellant changes which species you emit, not whether you emit:

- **Solid → liquid** removes the chlorine, and with it the ozone mechanism
  described above. Probably the single highest-leverage substitution available.
- **Kerolox → methalox** reduces black carbon; increases H₂O and CO₂.
- **Hydrolox** removes carbon; deposits water vapour, which is radiatively
  active and supports the polar stratospheric clouds that enable heterogeneous
  chlorine chemistry.

There is no inert option. There are only different species.

### Alternative structural materials

Silica is the substitution this repo already explores, in `Silica-sim.js` — on
the argument that it settles naturally and returns to the dust cycle rather than
accumulating. Note that simulation is unvalidated (U-9): it parses, it has never
been rendered, and its outputs have never been checked.

### Stratospheric aerosol injection

Not a space-industry emission — deliberate solar geoengineering, included because
the README and executive summary both invoke Al/S catalytic synergism as a
central mechanism. It is listed in the inventory so that claim has somewhere to
attach. **The synergism claim has no supporting run, model, or citation anywhere
in this repo.** (U-15)

---

## Why the model reports blanks

`Multi-species-accumulation.py` will not give you a combined coupling
coefficient. This is deliberate.

Folding species into one χ requires knowing each one's conductivity
contribution relative to Al₂O₃ — an `em_coupling_weight`. **Those weights do not
exist.** Nobody has measured them, and this repo has no basis for inventing them.
Detection is not coupling: knowing copper is up there says nothing about whether
it changes conductivity in a dispersed, oxidised, nanoparticle state. Bulk
copper's conductivity does not transfer.

So the model reports per-species burdens where a flux is known, reports χ from
Al₂O₃ alone exactly as before, and lists the rest as blank with the reason
stated. A table of confident numbers would be worth less than the honest gap,
because it would conceal the thing a reader most needs to know.

`--speculative-weights` shows the *shape* such a calculation would take, using
invented round numbers, behind a loud warning, writing nothing to disk. Its
output is instructive precisely because it fails: even with weights supplied,
almost every row reads `cannot weight an unknown flux`. Two unknowns stack —
fluxes (U-11) and weights (U-12) — and only fixing both makes multi-species χ
meaningful.

---

## References

Full detail, including retrieved findings verbatim, in
[`species_inventory.json`](species_inventory.json) → `references`.

- Murphy, D. M., et al. (2023). Metals from spacecraft reentry in stratospheric
  aerosol particles. *PNAS* 120(43), e2313374120.
  [10.1073/pnas.2313374120](https://doi.org/10.1073/pnas.2313374120)
- Ferreira, J. P., et al. (2024). Potential Ozone Depletion From Satellite Demise
  During Atmospheric Reentry in the Era of Mega-Constellations. *GRL* 51.
  [10.1029/2024GL109280](https://doi.org/10.1029/2024GL109280)
- Maloney, C. M., et al. (2022). The Climate and Ozone Impacts of Black Carbon
  Emissions From Global Rocket Launches. *JGR Atmospheres*.
  [10.1029/2021JD036373](https://doi.org/10.1029/2021JD036373)
- Ryan, R. G., et al. (2022). Impact of Rocket Launch and Space Debris Air
  Pollutant Emissions on Stratospheric Ozone and Global Climate. *Earth's Future*.
  [10.1029/2021EF002612](https://doi.org/10.1029/2021EF002612)
- The impact of rocket-emitted chlorine on stratospheric ozone. *ACP* 26, 3621 (2026).

All marked unverified against primary sources — see U-14.
