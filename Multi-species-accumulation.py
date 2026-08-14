"""Multi-species accumulation across both space-industry emission pathways.

Extends the single-species Al2O3 model in Accumulation-with-coupling.py to the
full species inventory in species_inventory.json (satellite reentry ablation +
launch exhaust).

WHAT THIS MODEL WILL NOT DO
---------------------------
It will not give you a combined coupling coefficient across species.

The chi law takes one burden number. Folding several species into one number
requires knowing how much each contributes to conductivity relative to Al2O3 —
an `em_coupling_weight` per species. Those weights do not exist. Nobody has
measured them, and this repo has no basis for inventing them.

So by default this model reports per-species burdens (defensible arithmetic
wherever a flux is known) and reports chi from Al2O3 alone, exactly as before.
The other species are listed with their burdens blank and the reason stated.

That blankness is the finding. A table of confident numbers here would be
worth less than the honest gap, because it would hide exactly the thing a
reader needs to know: the inventory is much wider than the model.

Run with --speculative-weights to see the shape a combined calculation would
take. It prints placeholder weights, shouts about it, and refuses to write
anything to disk. Never cite that output.

Usage:
    python Multi-species-accumulation.py
    python Multi-species-accumulation.py --years 40
    python Multi-species-accumulation.py --speculative-weights
"""

import argparse
import importlib.util
import json
import pathlib
import sys

import numpy as np

HERE = pathlib.Path(__file__).parent
INVENTORY_PATH = HERE / "species_inventory.json"

# Reuse the reference chi law rather than reimplementing it (see CLAUDE.md).
_spec = importlib.util.spec_from_file_location(
    "accumulation_with_coupling", HERE / "Accumulation-with-coupling.py"
)
model = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(model)

# Placeholder weights used ONLY under --speculative-weights. These are not
# estimates. They are round numbers chosen to make the arithmetic runnable.
# They have no empirical content whatsoever.
SPECULATIVE_WEIGHTS = {
    "al2o3_reentry": 1.0,
    "alumina_launch": 1.0,
    "lithium": 0.5,
    "copper": 0.5,
    "lead": 0.1,
    "niobium": 0.1,
    "hafnium": 0.1,
    "black_carbon": 0.2,
}


def load_inventory():
    return json.loads(INVENTORY_PATH.read_text())


def accumulate(annual_injection_mt, residence_years, years, growth_rate):
    """Burden time series for one species under the repo's rectangular kernel.

    Same kernel as Accumulation-with-coupling.py: full retention for
    `residence_years`, then instantaneous removal. See RESEARCH_LOG U-3.
    """
    buf = np.zeros(int(residence_years))
    out = []
    for y in range(years):
        buf[0] += annual_injection_mt * ((1 + growth_rate) ** y)
        out.append(buf.sum())
        buf = np.roll(buf, 1)
        buf[0] = 0
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--years", type=int, default=25)
    ap.add_argument("--growth-rate", type=float, default=model.GROWTH_RATE)
    ap.add_argument("--start-year", type=int, default=2025)
    ap.add_argument("--speculative-weights", action="store_true",
                    help="illustrate a combined chi using invented weights (never cite)")
    args = ap.parse_args()

    inv = load_inventory()
    species = inv["species"]

    print("=" * 78)
    print("SPECIES INVENTORY — what the space industry puts into the upper atmosphere")
    print("=" * 78)
    print(f"{'species':<34}{'pathway':<20}{'flux MT/yr':>12}  status")
    print("-" * 78)
    quantified, unquantified = [], []
    for s in species:
        flux = s.get("annual_injection_mt")
        st = s.get("annual_injection_status", "unquantified")
        shown = f"{flux:.1f}" if flux is not None else "--"
        print(f"{s['name'][:33]:<34}{s['pathway']:<20}{shown:>12}  {st}")
        (quantified if flux is not None else unquantified).append(s)

    print("-" * 78)
    print(f"  {len(species)} species tracked | {len(quantified)} with a flux estimate "
          f"| {len(unquantified)} unquantified")
    print(f"  Coverage: this repo can put a number on {len(quantified)}/{len(species)} "
          f"({100 * len(quantified) / len(species):.0f}%) of the species it knows are up there.")

    print()
    print("=" * 78)
    print("BURDEN PROJECTION — only for species with a known flux")
    print("=" * 78)
    if not quantified:
        print("  none")
    for s in quantified:
        res = s.get("residence_time_years")
        if res is None:
            print(f"  {s['name']}: flux known but residence time unquantified — cannot accumulate.")
            continue

        # Guard against the H-01 failure mode: a measured flux carries the year
        # it was measured in, and silently treating it as the start-year value
        # shifts the whole curve. That exact mistake produced the five-year
        # error this repo had to retract. Warn, loudly, rather than absorb it.
        flux_year = s.get("annual_injection_year")
        if flux_year is not None and flux_year != args.start_year:
            gap = args.start_year - flux_year
            factor = (1 + args.growth_rate) ** gap
            print(f"\n  [!] YEAR MISMATCH — {s['name']}: flux is a {flux_year} measurement "
                  f"but is being applied as the {args.start_year} baseline.")
            print(f"      At {args.growth_rate:.0%}/yr growth, {gap} years of compounding is a "
                  f"factor of {factor:.2f}.")
            print(f"      Left uncorrected on purpose — correcting it would mean asserting a "
                  f"{args.start_year} flux nobody measured.")
            print(f"      Treat the burdens below as a LOWER BOUND. See RESEARCH_LOG H-01, U-8.")
        series = accumulate(s["annual_injection_mt"], res, args.years, args.growth_rate)
        print(f"\n  {s['name']}  "
              f"(flux {s['annual_injection_mt']} MT/yr, residence {res} yr, "
              f"growth {args.growth_rate:.0%}/yr)")
        print(f"    {'year':<8}{'burden MT':>12}{'chi':>10}  regime")
        for i in (0, args.years // 2, args.years - 1):
            y = args.start_year + i
            b = series[i]
            if s["id"] == "al2o3_reentry":
                chi = model.calculate_coupling_coefficient(b, model.SOLAR_ACTIVITY_INDEX)
                print(f"    {y:<8}{b:>12.1f}{chi:>10.2f}  {model.risk_level(chi)}")
            else:
                print(f"    {y:<8}{b:>12.1f}{'n/a':>10}  (no chi: species not in the chi law)")

    print()
    print("=" * 78)
    print("WHAT IS MISSING — the actual result of this run")
    print("=" * 78)
    print("  Species present in the stratosphere with NO flux estimate in this repo:")
    for s in unquantified:
        print(f"    - {s['name']:<42} ({s['pathway']})")
    print()
    print("  Consequence: no total burden across species can be computed, and no")
    print("  combined coupling coefficient can be computed. The chi figure this")
    print("  project publishes describes ONE species out of "
          f"{len(species)} known to be present.")

    # Pathway coverage
    paths = {}
    for s in species:
        paths.setdefault(s["pathway"], []).append(s)
    print()
    print("  By pathway:")
    for p, members in sorted(paths.items()):
        q = sum(1 for m in members if m.get("annual_injection_mt") is not None)
        print(f"    {p:<20} {len(members):>2} species, {q} quantified")
    print()
    print("  The launch-exhaust pathway is entirely unquantified here, and it")
    print("  deposits the SAME Al2O3 the reentry model tracks (alumina_launch).")
    print("  Every burden figure this repo publishes is therefore an undercount")
    print("  of total atmospheric Al2O3 by an unknown margin. See H-11.")
    print()
    print("  Chlorine (hcl_launch) is the sharpest gap: Al2O3 destroys ozone by")
    print("  activating chlorine and is not consumed doing it, so the reentry")
    print("  pathway's ozone impact is CO-LIMITED by a launch-pathway species")
    print("  this repo does not model. See H-12.")

    if args.speculative_weights:
        print()
        print("!" * 78)
        print("!!  SPECULATIVE MODE — THE NUMBERS BELOW ARE NOT ESTIMATES")
        print("!!")
        print("!!  The weights are invented round numbers. They exist to show the")
        print("!!  SHAPE of a combined calculation, not its value. No measurement")
        print("!!  supports any of them. Nothing is written to disk in this mode.")
        print("!!  Do not cite, screenshot, or quote this block.")
        print("!" * 78)
        print(f"  {'species':<34}{'weight':>10}  {'flux':>10}  weighted")
        total_weighted_flux = 0.0
        for s in species:
            w = SPECULATIVE_WEIGHTS.get(s["id"])
            flux = s.get("annual_injection_mt")
            if w is None:
                continue
            if flux is None:
                print(f"  {s['name'][:33]:<34}{w:>10.2f}  {'--':>10}  "
                      f"cannot weight an unknown flux")
                continue
            total_weighted_flux += w * flux
            print(f"  {s['name'][:33]:<34}{w:>10.2f}  {flux:>10.1f}  {w * flux:>8.1f}")
        print(f"\n  Al2O3-equivalent flux from QUANTIFIED species only: "
              f"{total_weighted_flux:.1f} MT/yr")
        print("  Every unquantified species contributes an unknown positive amount")
        print("  on top of that, so even this speculative figure is a lower bound")
        print("  on a quantity whose true value nobody in this repo knows.")

    print()
    print("Sources for every sourced value: species_inventory.json -> references.")
    print("None verified against primary publications from this environment (U-14).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
