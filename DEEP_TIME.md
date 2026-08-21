# Deep Time: The Experiment That Already Ran

**The repo's forward horizon is 40 years. Its backward horizon is zero.**

For a hypothesis about slow atmospheric-electrical forcing, the only empirical
constraint available is the paleo record — and this project uses none of it.

Grep across every model file: `paleo` 0 · `Holocene` 0 · `ice core` 0 ·
`Myr` 0 · `excursion` 0 · `Laschamp` 0 · `supernova` 0 · `Milankovitch` 0.

> **Verification caveat.** Sources gathered by web search 2026-08-21; publisher
> domains remain blocked by this environment's egress policy, so these are
> abstracts and secondary summaries, not full papers. Same caveat class as U-14.
> One central claim below is **actively contested in the literature** and is
> marked as such.

---

## Why this is a gap and not a digression

The hypothesis (H-00) is that a slowly accumulating particle population changes
atmospheric electrical properties enough to drive cascade failure. Testing it
needs a case where atmospheric electrical properties changed a lot.

**Those cases exist.** Earth has been running the experiment for 4.5 Gyr, at
amplitudes far exceeding anything satellite reentry can produce, and the results
are recorded in ocean sediments, ice cores, and lunar regolith.

Using them requires no new instrument and no new funding. It requires looking
backwards, which this project has never done.

---

## What the record contains

### 1. Continuous cosmic dust accretion — 4.5 Gyr, ongoing

The repo's own `orbital_parameters` put meteoric input at ~19,710 t/yr, of which
~2% (~394 t/yr) is Al₂O₃. At 5-year residence that is a **standing burden of
~1,970 MT — about 2× the repo's own 1,000 MT critical threshold** (H-15).

Deep time sharpens that from an awkward fact into a hard constraint: the
threshold has not merely been exceeded *recently*. It has been exceeded
**continuously, for the entire history of the planet**, with no phase
transition in the record.

### 2. Nearby supernovae — ~2.3 and ~1.5 Myr ago

⁶⁰Fe (and ⁵³Mn) found in deep-sea sediments and crusts from the Pacific,
Atlantic and Indian Oceans, concentrated **3.2–1.7 Myr ago**, with events dated
to roughly 2.3 and 1.5 Myr. These isotopes are made in massive stars and decay
completely in 4–15 Myr, so their presence is unambiguous recent delivery.
Source distance estimated at **<300 light years** — bright enough to be visible
in daylight.

The forcing this delivered:

- **~100-fold increase in cosmic ray flux, sustained for several centuries**
  (TeV–PeV flux possibly a few hundred fold)
- Atmospheric ionisation → NOx production → **stratospheric ozone depletion**
- Enhanced ion-mediated formation of cloud condensation nuclei

**This is the single most relevant natural experiment available**, and it is a
direct analogue of the repo's own proposed mechanism: a large, sustained change
in atmospheric ionisation. It is also two to three orders of magnitude larger
than anything nanoparticle loading could plausibly do.

**The outcome matters enormously.** A 2024 *Communications Earth & Environment*
study finds that biosphere impacts from enhanced cosmic radiation were
**limited by compensating effects** — ozone catalytic cycles partially
self-cancelling, and increased cloud and aerosol abundance offsetting.

That is a measurement of **negative feedback**. The atmosphere absorbed a ~100×
ionisation forcing and buffered it.

### 3. The Laschamp excursion — ~41 kyr ago

Earth's magnetic field fell to **~10% of modern strength**, with the poles
migrating away from geographic. Dipole reduction and tilting spanned ~300 years;
the full excursion lasted ~2,000 years. The auroral oval wandered toward
equatorial latitudes.

Documented consequences: reduced cutoff rigidity, a surge in cosmic radiation,
cosmic-radiation-driven **ozone depletion**, and mid-latitude UV-B increase —
amplified where it coincided with Grand Solar Minima.

**This one cuts against the buffering story**, and is presented that way here.
Cooper et al. (2021, *Science*) argue for a wider "Adams Event" cascade:
climate reorganisation, Australian megafaunal extinction, Neanderthal
disappearance, and the onset of figurative cave art.

> ⚠ **Contested.** The broader causal chain in Cooper et al. — particularly the
> extinction and archaeological attributions — drew substantial criticism and
> is not settled. The **ozone/UV-B and geomagnetic components are on much
> firmer ground than the biological and cultural ones.** Cite the first, not
> the second. Recording a contested paper as established would be exactly the
> failure this repo exists to catch.

### 4. The Moon as an unweathered archive

⁶⁰Fe from the same supernova events has been recovered from lunar samples. The
Moon has no atmosphere, ocean or plate tectonics to process the signal, which
makes it the **control sample** for exterior material flux — Earth's record with
the planetary processing removed.

This is the most direct answer to "is there cosmology information about exterior
bodies and their impact on the planet": yes, and one of the archives is a body
that has been passively recording the same flux with none of Earth's confounds.

---

## What the record constrains

### It bounds the geomagnetic risk from above

`Geomagnetic-dynamics.py` treats ~5%/century dipole decay as a novel risk
trajectory heading somewhere unprecedented.

**Laschamp was a ~90% reduction.** The record therefore already contains the
answer to "what happens when the shielding largely fails": significant,
regionally severe ozone and UV-B effects, plausible ecological stress, recovery
within ~2,000 years, **and no runaway**. The dipole decay the repo tracks is
heading toward a state the planet has occupied repeatedly.

### It bounds the ionisation mechanism from above

A ~100× cosmic ray increase sustained for centuries is a vastly larger
perturbation to atmospheric ionisation than a few percent conductivity change
from nanoparticles — even granting the repo's assumed sign, which H-19 disputes.
The measured response was **compensating**, not amplifying.

### It falsifies "unprecedented forcing" — but not the project

The forcing is not unprecedented. **The exposure is.**

None of these events happened to a civilisation dependent on GPS timing, on
transformer networks vulnerable to geomagnetically induced currents, or on
semiconductors with nanometre feature sizes. The biosphere buffered these
forcings; there is no record at all of how a technological substrate responds,
because none existed.

**This is a stronger foundation than the one the repo currently stands on.**
"An ordinary forcing meeting an unprecedented vulnerability" is defensible and
testable. "An unprecedented forcing" is not, and the record contradicts it.

---

## The framing bias this exposes

Three structural biases, now recorded as S-12 … S-14 in
[`STRUCTURAL_LIMITS.md`](STRUCTURAL_LIMITS.md):

**S-12 — No deep-time baseline.** Forward horizon 40 years, backward horizon
zero, for processes with characteristic times of 10³–10⁶ years. The measurement
era (~50 years of satellite data) is far too short to establish what natural
variance even looks like, which makes attribution structurally hard — the same
problem H-17 hit with ENSO, one timescale up.

**S-13 — The modelled world can only amplify.** Grep for stabilising terms
across every model: `recovery` 0 · `damping` 0 · `relaxation` 0 ·
`equilibration` 0 · `saturation` 0 · `resilience` 0 · `self-limiting` 0.
There is not one negative feedback anywhere. Yet the dominant signal in the
paleo record is **buffering** — compensating chemistry, offsetting cloud
response, recovery on millennial timescales. The model form encodes pure
amplification, and the empirical record contradicts that form.

**S-14 — Asymmetric skepticism.** SAI is scrutinised as a hazard, correctly.
But the README's own "Next Steps" propose stratospheric particle collection
technology and atmospheric EM energy harvesting with **no equivalent
scrutiny** — no coupling analysis, no failure modes, no unintended-consequence
accounting. Natural variability is treated as background; intervention is
treated as solution.

That asymmetry has a consequence: **a model that represents only amplification,
and considers only engineered remedies, will conclude that intervention is
necessary regardless of what you feed into it.** The conclusion is partly in the
model's architecture rather than in its inputs.

---

## What to actually do with this

1. **Use Laschamp as a calibration event.** A ~90% shielding reduction with a
   measured ozone response is a constraint on any coupling coefficient. If the
   repo's χ predicts cascade at burdens whose electrical effect is far smaller
   than Laschamp's, and Laschamp produced no cascade, χ is too steep. This is
   the closest thing to an empirical calibration available — and it costs a
   literature review, not an instrument.
2. **Use the supernova events the same way**, for the ionisation channel
   specifically.
3. **Add at least one stabilising term** (S-13), or state explicitly and
   defensibly that the system has none. The current model implies no
   homeostasis at all, which nothing in the record supports.
4. **Reframe from unprecedented forcing to unprecedented exposure.** It is
   more defensible, it survives the paleo record, and it points the project at
   infrastructure vulnerability — which is what its logistics-fragility thread
   was always actually about.

---

## Sources

- ⁶⁰Fe supernova deposition: [ScienceDaily summary](https://www.sciencedaily.com/releases/2016/04/160406133622.htm) ·
  [lunar ⁶⁰Fe, *Science*](https://www.science.org/content/article/earth-barraged-supernovae-millions-years-ago-debris-found-moon)
- Supernova atmospheric effects: [*Communications Earth & Environment* (2024)](https://www.nature.com/articles/s43247-024-01490-9) ·
  [Thomas et al., *ApJ* — supernova at 50 pc](https://iopscience.iop.org/article/10.3847/1538-4357/aa6c57)
- Laschamp geomagnetic excursion: [*Science Advances* — auroral oval 41 ka](https://www.science.org/doi/10.1126/sciadv.adq7275) ·
  [Cooper et al., *Science* (2021) — **contested**](https://www.science.org/doi/10.1126/science.abb8677)

All unverified against primary sources from this environment (U-14, U-23).
