"""Regenerate published numbers and re-run the consistency checks.

    python reproduce.py           # print the checks
    python reproduce.py --write   # also rewrite coupling_config.json's series

Every claim in RESEARCH_LOG.md that is marked "reproducible" is produced by
this script. If you change the model, run this and commit the diff — that is
how a claim gets revised rather than quietly drifting.
"""

import argparse
import importlib.util
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).parent
CONFIG_PATH = HERE / "coupling_config.json"

# The model file is hyphenated, so load it by path.
_spec = importlib.util.spec_from_file_location(
    "accumulation_with_coupling", HERE / "Accumulation-with-coupling.py"
)
model = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(model)

REPORT_YEARS = [2025, 2030, 2035, 2040, 2045]


def full_series(years=60, residence_time=None):
    kw = {} if residence_time is None else {"residence_time": residence_time}
    return {y: (b, c, r) for y, b, c, r in model.run(years_to_run=years, **kw)}


def projected_series(series):
    """The series published in coupling_config.json.

    Regime labels are the model's own, verbatim. An earlier revision
    translated them into a second vocabulary (Stable/Degraded/Critical);
    that translation layer was a place for the two to drift apart, so it
    is gone.
    """
    return [
        {
            "year": y,
            "burden_mt": round(series[y][0], 1),
            "chi": round(series[y][1], 3),
            "regime": series[y][2],
        }
        for y in REPORT_YEARS
    ]


def threshold_crossings(series):
    limits = [("incipient", 0.5), ("systemic_fragility", 1.5),
              ("pre_cascade", 3.0), ("cascade_failure", 5.0)]
    out, prev = {}, 0.0
    for y in sorted(series):
        chi = series[y][1]
        for name, lim in limits:
            if prev <= lim < chi and name not in out:
                out[name] = {"year": y, "burden_mt": round(series[y][0], 1),
                             "chi": round(chi, 2)}
        prev = chi
    return out


def residence_time_conflict(years=60):
    """H-13: two cited sources disagree about residence time by 6x.

    Reported on every run rather than resolved, because resolving it by
    picking a favourite would hide a live disagreement between the source
    of our yield figure and the source of our transport figure.
    """
    rows = []
    for label, rt in (("5 yr (Plane 2012, Megner 2008)", model.RESIDENCE_TIME_YEARS),
                      ("30 yr (Ferreira 2024)", model.RESIDENCE_TIME_ALT_YEARS)):
        s = full_series(years, residence_time=rt)
        cross = next((y for y in sorted(s)
                      if s[y][0] >= model.CRITICAL_THRESHOLD_MT), None)
        rows.append({
            "label": label,
            "residence_time_years": rt,
            "burden_2045": round(s[2045][0], 1) if 2045 in s else None,
            "crossing_1000mt": cross,
        })
    return rows


def check_discontinuity():
    t = model.CRITICAL_THRESHOLD_MT
    s = model.SOLAR_ACTIVITY_INDEX
    below = model.calculate_coupling_coefficient(t - 0.1, s)
    above = model.calculate_coupling_coefficient(t + 0.1, s)
    return below, above, above / below


def injection_rate_variants():
    """Every 'current annual Al2O3 injection' figure asserted in the repo."""
    return [
        ("Accumulation-with-coupling.py", 500 * 30 / 1000,
         "500 reentries/yr x 30 kg"),
        ("README table (2024 row)", 40.0,
         "730 reentries -> stated ~40 MT/yr"),
        ("same rate applied to 730 reentries", 730 * 30 / 1000,
         "730 x 30 kg"),
        ("Satellite-pollution-model.js", 730 * 550 * 0.15 / 1000,
         "730 x 550 kg x 15% Al"),
        ("README executive summary", 450.0,
         "stated ~450 MT/yr as a *current* rate"),
        ("README table (Starlink full deploy)", 460.0,
         "8,400 reentries -> stated ~460 MT/yr"),
    ]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true",
                    help="rewrite coupling_config.json's projected_time_series")
    args = ap.parse_args()

    series = full_series()

    print("=" * 68)
    print("PROJECTED SERIES (regenerated from Accumulation-with-coupling.py)")
    print("=" * 68)
    print(f"{'year':<8}{'burden_mt':>12}{'chi':>8}  regime")
    for row in projected_series(series):
        print(f"{row['year']:<8}{row['burden_mt']:>12.1f}{row['chi']:>8.2f}  {row['regime']}")

    print()
    print("=" * 68)
    print("THRESHOLD CROSSINGS")
    print("=" * 68)
    for name, x in threshold_crossings(series).items():
        print(f"  {name:<20} {x['year']}   burden {x['burden_mt']:>9.1f} MT   chi {x['chi']:.2f}")

    print()
    print("=" * 68)
    print("H-13  residence time — TWO CITED SOURCES, 6x APART, UNRESOLVED")
    print("=" * 68)
    print(f"  {'assumption':<34}{'burden 2045':>14}{'1000 MT crossed':>18}")
    for r in residence_time_conflict():
        b = f"{r['burden_2045']:.1f} MT" if r["burden_2045"] is not None else "n/a"
        c = r["crossing_1000mt"] or "not within run"
        print(f"  {r['label']:<34}{b:>14}{str(c):>18}")
    print("  The model defaults to 5 yr. Both are cited; neither is settled here.")
    print("  Measured effect: a 6x disagreement in residence time moves the 2045")
    print("  burden by only ~1.9x and the 1000 MT crossing by 4 years. Under 15%/yr")
    print("  growth the recent cohorts dominate, so the older ones matter less than")
    print("  the 6x gap suggests. Worth resolving, but not the biggest lever.")

    print()
    print("=" * 68)
    print("H-04  chi discontinuity at the branch point")
    print("=" * 68)
    below, above, ratio = check_discontinuity()
    t = model.CRITICAL_THRESHOLD_MT
    print(f"  chi({t - 0.1} MT) = {below:.4f}")
    print(f"  chi({t + 0.1} MT) = {above:.4f}")
    print(f"  jump factor       = {ratio:.2f}x  <-- artefact of the piecewise law")

    print()
    print("=" * 68)
    print("H-02  'current annual Al2O3 injection' as asserted across the repo")
    print("=" * 68)
    for source, value, basis in injection_rate_variants():
        print(f"  {value:>7.1f} MT/yr   {source:<38} ({basis})")
    print("  --> spread of 30x between the lowest and highest figure.")

    print()
    print("=" * 68)
    print("H-03  Al metal vs Al2O3 mass")
    print("=" * 68)
    f = 101.96 / (2 * 26.98)
    print(f"  stoichiometric factor Al -> Al2O3 = {f:.3f}")
    print(f"  15% of a 550 kg satellite as Al metal, fully oxidised = {550 * 0.15 * f:.1f} kg Al2O3")
    print(f"  30 kg Al2O3 from a 250 kg satellite implies Al metal   = {30 / f / 250 * 100:.1f}% of dry mass")
    print("  --> the two figures differ by 5.2x; the repo uses 'aluminum' for both.")

    if args.write:
        cfg = json.loads(CONFIG_PATH.read_text())
        cfg["projected_time_series"] = projected_series(series)
        cfg["provenance"]["threshold_crossings"] = threshold_crossings(series)
        CONFIG_PATH.write_text(json.dumps(cfg, indent=2) + "\n")
        print(f"\nwrote {CONFIG_PATH.name}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
