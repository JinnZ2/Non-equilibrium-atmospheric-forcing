# Structural Limits

**What no parameter value can fix.**

Run: `python Structural-audit.py` — everything below is computed or read from
the code, not asserted.

---

## Why this file is separate from RESEARCH_LOG.md

`RESEARCH_LOG.md` tracks **parametric** unknowns, U-1 … U-22: *we don't know
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

---

## What this does and does not mean

**It does not falsify H-00.** Metals from reentry are measured and real (Murphy
et al. 2023). Al₂O₃ catalysing chlorine-mediated ozone loss is a documented
mechanism (Ferreira et al. 2024). Those stand independently of anything here.

**It does mean the current models cannot test H-00.** They have no state space
for the physics that would decide it, no coupling between the domains they
name, and at least one mechanism (S-8) that the geometry rules out. The gap
between "this repository" and "a model that could evaluate this hypothesis" is
structural, not parametric.

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
5. **Ground χ in units** (S-10). Until then it cannot be checked against any
   observation, which makes the whole risk-regime table unfalsifiable.
