# legacy/

Superseded artefacts, kept verbatim.

**Nothing here is deleted, and nothing here is edited.** These files record
what was claimed and when. Precedence carries: the date an idea was first
written down is part of the record, and a claim that is later revised does not
stop having been made. Deleting a falsified artefact destroys the evidence that
the revision happened at all.

**Nothing here is current.** Do not cite these numbers, import these modules,
or copy these parameters into new work. Every file below has a named successor.
If you find yourself wanting a number from this folder, the number you want is
in the successor — and if it isn't, that is a finding worth logging in
`../RESEARCH_LOG.md`.

The reasoning behind each retirement is in `../RESEARCH_LOG.md` under the
hypothesis ID given below.

---

## Contents

### `Aluminum-loading.py`

| | |
|---|---|
| **First committed** | 2025-12-16 (`f1eaa8d`, "Create Aluminum-loading.py") |
| **Last modified** | 2026-03-22 on `main` (`2876b0a`) — see note below |
| **Retired** | 2026-08-14, archived at its final state 2026-08-17 |
| **Superseded by** | `../Accumulation-with-coupling.py` |
| **Log entry** | H-08, H-16 |

> **Archived at its final state, not its original one.** This file was retired
> on a branch while parallel work on `main` was still actively maintaining it.
> The version here is `main`'s last one — the file as it stood when retirement
> actually took effect — because that is what "the artefact as retired" means.
> The 2025-12-16 original remains in git history at `f1eaa8d`.
>
> That concurrent maintenance is itself the argument for retiring it. `main`'s
> commit had to "standardize satellite reentry baseline to 730/year across
> Python files" and "standardize growth rate to 15% across Python files" —
> manually syncing constants duplicated between this file and its successor.
> That is the cost duplication imposes, and it is exactly the drift H-01 and
> H-14 are about. The successor now carries those parameters as named module
> constants, so there is one place to change them.
>
> One of `main`'s changes here was described as fixing an `np.roll` wrap-around
> bug. Tested: there was no bug — both forms are numerically identical and both
> match a direct cohort-sum reference. The clearer `a[1:] = a[:-1]` form was
> adopted in the successor anyway. See H-16.

The first written statement of the Al₂O₃ accumulation model, and the origin of
three parameters the project still relies on: 30 kg of Al₂O₃ per reentering
satellite, a 30-year stratospheric residence time, and an exponential launch
growth rate.

Retired because its accumulation core is reproduced inside the successor —
same per-satellite yield, same 30-year `np.roll` residence buffer, same growth
structure — which adds the χ coupling term on top. It is the earlier draft of
one model, not a second independent model. Keeping both invited the reader to
treat two runs of the same arithmetic as two lines of evidence.

**Known defect, inherited by the successor:** the comment says *"Using a simple
linear decay model for atmospheric fallout"*, but the implementation is a
**rectangular** kernel — full retention for exactly 30 years, then total
instantaneous removal at year 30. There is no decay of any kind, linear or
otherwise. Recorded as U-3.

---

### `coupling_config.2025-12-16.json`

| | |
|---|---|
| **First committed** | 2025-12-16 (`d61d3ca`, "Create coupling_config.json") |
| **Retired** | 2026-08-14 |
| **Superseded by** | `../coupling_config.json` |
| **Log entries** | H-01 (series), H-05 (thresholds) |

The originally published parameter set and four-point projection. This is the
artefact the project's headline claims were read off, so it is the one most
worth preserving intact.

Retired for two reasons:

1. **The projected series does not reproduce from the repo's own model** (H-01).
   It is the model's own output displaced five years earlier — three of its
   four points land on the model's value for the year five later, χ included.
   Because the executive summary's "Year of Collapse 2035–2038" was read off
   this table, the offset propagated into the policy brief's headline date.
   The model's actual crossing is 2040.

2. **Its cascade threshold contradicted the code** (H-05). This file set
   `cascade_failure.chi_limit = 5.0`; `Accumulation-with-coupling.py` has always
   labelled `CASCADE FAILURE` at χ ≥ 3.0, leaving the band 3.0–5.0 unassigned
   by any regime. Resolved in the successor in favour of the code, which is
   what actually generated every published number. What the 5.0 originally
   meant is not recoverable.

The successor's `projected_time_series` is **generated, not authored** — run
`python ../reproduce.py --write` to regenerate it — and carries a `provenance`
block naming the model file and its parameters, so this class of drift cannot
recur silently.

---

## Retiring something else

1. Confirm it is genuinely superseded, and name the successor. "Old" is not
   the same as "superseded"; an artefact with no successor is still current.
2. `git mv` it here **unchanged**. Do not tidy it on the way in — a
   reformatted artefact is no longer evidence of what was claimed.
3. If it is a dated snapshot of a file that still exists under its own name,
   suffix it with the date it was authored (as with the config above) so the
   successor keeps the clean filename.
4. Add a row here: first-committed date and commit, retirement date,
   successor, log entry.
5. Add the corresponding entry to `../RESEARCH_LOG.md` with the run that
   settled it. The retirement is the conclusion; the log holds the reasoning.
