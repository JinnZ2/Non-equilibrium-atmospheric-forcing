# Structural Limits

**What no parameter value can fix.**

Run: `python Structural-audit.py` — everything below is computed or read from
the code, not asserted.

---

## Why this file is separate from RESEARCH_LOG.md

`RESEARCH_LOG.md` tracks **parametric** unknowns, U-1 … U-25: *we do not know
this number.* Every one is fixable by finding a better value.

This file tracks **structural** limits, S-1 … S-11: *the model has no variable
for this,* so no value of any parameter fixes it.

The distinction went unexamined for the whole life of this project. Work has
been improving steadily along the parametric axis — sourcing the Al₂O₃ yield,
correcting the gyrofrequency, contesting the residence time, adding ENSO — while
the structural axis stayed where it started. **Sourcing every parameter in a
model whose state space is wrong produces a well-cited wrong answer.** Precision
about inputs reads as rigour and is not the same thing.

That is the honest reading of a repository whose parametric hygiene is now
genuinely good.

---

## S-1 — No spatial dimension in the burden model

Burden is a single global scalar. No altitude, no latitude, no vertical grid.

Stratospheric aerosol is fundamentally altitude-resolved: particles are injected
near the mesopause and *descend*, and the entire ozone mechanism (H-12) depends
on where they are during that descent. Ferreira's "up to 30 years to settle from
the top of the mesosphere into the ozone layer" describes a **trajectory**. This
model has no coordinate to put a trajectory in.

`altitude_km`, `alt_high`, `alt_low`, `latitude_deg` exist — but only inside
`Chemical-interactions.py` and `Geomagnetic-dynamics.py`, which do not feed χ
(S-5). The burden model itself has no spatial coordinate at all.

## S-2 — No particle size distribution

`particle_radius_m` and `particle_diameter_m` exist as **single fixed values**.
There is no distribution anywhere.

This is not a missing parameter, it is a missing dimension:

- sedimentation velocity goes as **r²** (Stokes)
- ion–aerosol attachment goes as **surface area**
- optical and electrical response are size-dependent
- coagulation moves mass *between* sizes

A monodisperse assumption cannot produce any of these, and the model computes
none of them. Every size-dependent process is instead absorbed into the imposed
residence-time constant.

## S-3 — No microphysics

Absent as identifiers anywhere in the code: **nucleation, condensation,
coagulation, sedimentation, settling velocity.** Particles are inert from
injection until they age out of a buffer.

## S-4 — Residence time is imposed, not emergent

In a model with size and altitude, residence time is an *output* — it falls out
of settling plus transport. Here it is an input constant.

That is why **H-13 cannot be settled from inside this model.** Two cited sources
disagree by 6×, and the model has no machinery that could adjudicate, because
the quantity they disagree about is the very thing it declines to compute. The
constant is doing the work of all the physics S-1 through S-3 leave out.

## S-5 — There is no coupling in the coupling model

χ is a function of exactly two scalars:

```
calculate_coupling_coefficient(burden_mt, solar_activity_index)
```

And the module graph, read from the code:

| Module | Loads χ model | χ references |
|---|---|---|
| `Accumulation-with-coupling.py` | (defines it) | 15 |
| `Multi-species-accumulation.py` | yes | 8 |
| `ENSO-coupling.py` | yes | 6 |
| `reproduce.py` | yes | 12 |
| **`Chemical-interactions.py`** | **no** | **0** |
| **`Geomagnetic-dynamics.py`** | **no** | **0** |
| **`Orbital-coupling.py`** | **no** | **0** |

The three modules added to represent *coupling domains* — chemical, geomagnetic,
orbital — contain **zero references to the coupling coefficient.** They are
parallel calculators sharing a directory.

A project whose central criticism of institutional models is that they silo
coupled systems has built silos. That was recorded once as a specific missing
link (H-12, chlorine), but the general form is worse: there is no architecture
for links at all.

## S-6 — No feedback anywhere

Data flow is strictly one-way: `injection → burden → χ → label`. Nothing
downstream re-enters anything upstream.

A system with no loops cannot produce emergent thresholds, hysteresis, multiple
stable states, or critical slowing down. Those are the phenomena "complexity
economics" names, and none of them is available in a feed-forward pipeline.

## S-7 — Conductivity is asserted, never derived — and the sign is suspect

Air conductivity is **σ = Σ nᵢqᵢμᵢ**: carried by *mobile charge carriers in the
gas*, not by the bulk conductivity of suspended particles. `ion_density`,
`mobility` and `conductivity` appear as identifiers **nowhere in the code**.

Worse than missing — possibly inverted. The established ion–aerosol result is
that aerosol particles **scavenge small ions**, converting high-mobility
molecular ions into low-mobility charged aerosol, so conductivity **falls**.
Conductivity and aerosol loading are inversely related, and this has been
studied at stratospheric heights.

The repo's premise is *more particles → more conductivity*. That may be the
wrong sign. See H-19; this is now the deepest open question in the project.

## S-8 — The "conductive mesh" is not geometrically available

`README.md` and the executive summary claim high-density Al particulate forms a
conductive "mesh" supporting "geometric resonance". Tested against percolation
(φ ≈ 0.29 for random spheres), with 100 nm particles in a 15–50 km shell:

| Burden | Volume fraction | n (cm⁻³) | Mean spacing | In diameters |
|---|---|---|---|---|
| 22 MT (today) | 3.1×10⁻¹⁶ | 0.6 | 11.9 mm | 118,838 |
| **1,000 MT (threshold)** | **1.4×10⁻¹⁴** | 27 | **3.3 mm** | **33,299** |
| 1,970 MT (natural bg) | 2.8×10⁻¹⁴ | 53 | 2.7 mm | 26,563 |
| 39,552 MT (χ=5 burden) | 5.6×10⁻¹³ | 1,071 | 1.0 mm | 9,773 |

At the critical threshold the volume fraction falls short of percolation by
**13.3 orders of magnitude**, with roughly 33,000 particle diameters of empty
air between neighbours.

This is not a small effect. **It is not a mechanism.** No burden this repo
projects — including the χ = 5 cascade burden — comes within twelve orders of
magnitude of a percolating network.

## S-9 — The nonlinearity is hand-authored, not emergent

χ's shape comes from a quadratic glued to a logarithm at a hand-chosen branch
point. H-04 records the resulting 1.60× discontinuity, but the deeper issue is
that the *functional form itself* is arbitrary. In real complex systems,
threshold behaviour emerges from competing processes; here it was typed in.

## S-10 — χ is dimensionally ungrounded

χ = (MT/MT)² × an index whose scale is undefined (U-6). It is called
dimensionless, but it is not clear what physical quantity it is dimensionless
*of*. A quantity that cannot be expressed in units cannot be compared with a
measurement — which means χ is **unfalsifiable as currently defined**, and the
risk-regime boundaries inherit that.

## S-11 — No uncertainty propagation

Every number is a point estimate, despite `CONTRIBUTING.md` requiring
uncertainty bounds on Python submissions. Given U-2, U-5, U-8, U-12 and U-21 are
all unconstrained, honest error bars would likely span orders of magnitude —
which is itself the most useful thing they could show.

## S-12 — No deep-time baseline

Forward horizon: 40 years (longest `years_to_run`). Backward horizon: **zero**.

Grep across every model file: `paleo` 0 · `Holocene` 0 · `ice core` 0 · `Myr` 0 ·
`excursion` 0 · `Laschamp` 0 · `supernova` 0 · `Milankovitch` 0.

The processes at issue have characteristic times of 10³–10⁶ years. The
instrumental record is ~150 years and the satellite record ~50. That is far too
short to establish what natural variance looks like, which makes attribution
structurally hard — the same problem H-17 hit with ENSO, several timescales up.

Worse, it discards the only empirical constraint available. Earth has run this
experiment repeatedly at far larger amplitude, and the results are in ocean
sediments, ice cores and lunar regolith. See [`DEEP_TIME.md`](DEEP_TIME.md).

## S-13 — The modelled world can only amplify

Grep for stabilising terms across every model file:

| Term | Occurrences |
|---|---|
| `recovery` | 0 |
| `damping` | 0 |
| `relaxation` | 0 |
| `equilibration` | 0 |
| `saturation` | 0 |
| `resilience` | 0 |
| `self-limiting` | 0 |
| `homeostasis` | 0 |

Not one negative feedback anywhere. (`buffer` appears, but it is the
residence-time array, not a feedback.) Combined with S-6 — no loops at all —
the model represents a system that can accumulate and amplify and do nothing
else.

The paleo record's dominant signal is the opposite: **buffering**. A 2024 study
of nearby-supernova effects finds biosphere impacts *limited by compensating
effects* — self-cancelling ozone catalytic cycles and offsetting cloud/aerosol
response — under a ~100× cosmic ray increase sustained for centuries.

So this is not merely an omission. **The model form encodes an assumption the
empirical record contradicts.**

## S-14 — Asymmetric skepticism

SAI is scrutinised as a hazard, correctly and at length. The README's own "Next
Steps" propose stratospheric particle collection technology and atmospheric EM
energy harvesting with **no equivalent scrutiny** — no coupling analysis, no
failure modes, no unintended-consequence accounting. Natural variability is
treated as background; engineered intervention is treated as solution.

This has a structural consequence, not just a rhetorical one: **a model that
represents only amplification (S-13) and considers only engineered remedies
will conclude intervention is necessary regardless of its inputs.** Part of the
conclusion lives in the architecture rather than in the data.

## S-15 — The threshold is a level, not a rate

χ = f(burden). There is no `dburden/dt` term anywhere in the model, so the only
tipping condition it can express is **crossing a level**.

Rate-induced tipping is a distinct and well-documented failure mode: a system
tracks a slowly-moving equilibrium fine and loses track if forced too fast, with
no fixed level ever being the trigger. van Westen et al. (*Nature Climate
Change*, 2026) demonstrate exactly this for the AMOC — a +0.5 ppm/yr CO₂ ramp
leaves it stable past **+5.5 °C**, while faster ramps collapse it at **+2 °C**.
There is no safe temperature; the collapse condition is a derivative.

**Why this is not academic here.** Two trajectories through this model:

| | Constant 15 %/yr | Surge to 2035, then saturate |
|---|---|---|
| Burden 2040 | 687 MT | 1,510 MT |
| Burden 2080 | 184,012 MT | **1,510 MT (plateau)** |
| dB/dt 2035 | 45 MT/yr | **221 MT/yr (peak)** |
| dB/dt 2080 | 24,002 MT/yr | **~0** |
| Model verdict, 2080 | Cascade | **"Systemic Fragility" — permanently** |

Under constant exponential growth the two framings are **degenerate**: dB/dt ÷ B
sits at 0.130 across the whole run, so nothing is lost by using a level. That is
why the deficiency has been invisible.

It bites when the growth rate changes — the realistic case, since constellations
deploy and then saturate. On the surge trajectory a level model says risk is
permanently maxed; a rate model says risk peaked during deployment and fell as
the system re-equilibrated. **Opposite qualitative predictions from the same
burden history, and this model cannot represent the second one.**

Compounds with S-13: a system with no relaxation term cannot re-equilibrate
after a forcing rate drops, so the model has no way to represent recovery from
a deployment surge even in principle.

---

## What this does and does not mean

**It does not falsify H-00.** Metals from reentry are measured and real (Murphy
et al. 2023). Al₂O₃ catalysing chlorine-mediated ozone loss is a documented
mechanism (Ferreira et al. 2024). Those stand independently of anything here.

**It does mean the current models cannot test H-00** — and that the data which
*could* start to test it already exists, unused, in the paleo record
([`DEEP_TIME.md`](DEEP_TIME.md)). They have no state space
for the physics that would decide it, no coupling between the domains they
name, and at least one mechanism (S-8) that the geometry rules out. The gap
between "this repository" and "a model that could evaluate this hypothesis" is
structural, not parametric.

A **claim-audit protocol** derived from these failures — baseline choice, depth
exclusion, spatial averaging, comparator, unstated subject, level-vs-derivative —
is in [`CLAIM_AUDIT.md`](CLAIM_AUDIT.md). It was written to read outside
literature and turns out to catch this repo's own published numbers at the same
rate.

**Two structural items are also substantive claims about the world**, and both
cut against the thesis as written:

- **S-7:** the sign of the conductivity response may be backwards
- **S-8:** the conductive-mesh mechanism is unavailable by ~13 orders of magnitude

Neither has been rebutted here. They are the two things most worth arguing with.

## What would actually change the answer

In descending order of value per unit effort:

1. **Settle S-7's sign.** Does metallic nanoparticle loading raise or lower
   stratospheric conductivity? One literature review decides whether the project
   has its central mechanism pointing the right way. Nothing else on this list
   matters if the sign is wrong.
2. **Replace the mesh mechanism (S-8), or drop the claim.** If there is a real
   conductivity pathway it is neither percolation nor bulk mass fraction —
   candidates include ion scavenging (wrong sign), space-charge effects, or
   surface chemistry altering ion production. Name it or retire it.
3. **Give the model a size distribution and an altitude coordinate** (S-1, S-2).
   These are what make residence time (S-4, H-13) and surface area (H-12)
   derivable rather than assumed. Substantial work, and everything downstream
   depends on it.
4. **Connect the domain modules to χ, or stop calling them coupling** (S-5).
   Cheap, and it either produces the project's first real coupling or makes the
   naming honest.
5. **Calibrate χ against Laschamp** (S-12). A ~90% geomagnetic shielding
   reduction with a measured ozone response is an upper-bound constraint on any
   coupling coefficient. If χ predicts cascade at electrical perturbations far
   smaller than Laschamp's, and Laschamp produced no cascade, χ is too steep.
   Closest thing to an empirical calibration available, and it costs a
   literature review rather than an instrument.
6. **Add a stabilising term, or defend its absence** (S-13).
7. **Ground χ in units** (S-10). Until then it cannot be checked against any
   observation, which makes the whole risk-regime table unfalsifiable.
