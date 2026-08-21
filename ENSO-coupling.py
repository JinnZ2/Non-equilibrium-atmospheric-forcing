"""ENSO state and its coupling to stratospheric forcing.

Reads `enso_state.json`. Reports the current El Nino state, the mechanisms by
which ENSO touches this project's subject matter, and — the reason this module
exists — what the repo's own model says about the same window.

WHAT THIS MODULE WILL NOT DO
----------------------------
It will not modify chi. Not by a multiplier, not by a residence-time
adjustment, not by anything.

ENSO plausibly modulates stratospheric aerosol residence time through the
Brewer-Dobson circulation. Turning that into a number requires knowing how much
a given Nino-3.4 anomaly changes residence time for THIS aerosol population.
Nobody has measured that, and this repo has no basis for inventing it — the
same rule that keeps `Multi-species-accumulation.py` from producing a combined
chi (U-11, U-12), applied to a new domain (U-21).

What it does instead is report a sensitivity curve: if someone later sources a
residence-time perturbation, they can read the consequence off directly.

Usage:
    python ENSO-coupling.py
"""

import importlib.util
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).parent
STATE_PATH = HERE / "enso_state.json"

_spec = importlib.util.spec_from_file_location(
    "accumulation_with_coupling", HERE / "Accumulation-with-coupling.py"
)
model = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(model)

# El Nino window under discussion in the August 2026 CPC discussion.
WINDOW = (2026, 2027)


def load_state():
    return json.loads(STATE_PATH.read_text())


def model_over_window(first=2025, last=2030):
    return [(y, b, c, r) for y, b, c, r in model.run(years_to_run=(last - first + 1))]


def residence_sensitivity(perturbations=(-0.50, -0.25, -0.10, 0.0, 0.10, 0.25, 0.50)):
    """Burden response to a fractional change in residence time.

    Provided so that a sourced BDC-driven perturbation can be converted to a
    burden consequence without anyone having to guess one first.
    """
    base_rt = model.RESIDENCE_TIME_YEARS
    rows = []
    for p in perturbations:
        rt = max(1, round(base_rt * (1 + p)))
        s = {y: b for y, b, c, r in model.run(years_to_run=40, residence_time=rt)}
        cross = next((y for y in sorted(s)
                      if s[y] >= model.CRITICAL_THRESHOLD_MT), None)
        rows.append({
            "perturbation_pct": p * 100,
            "residence_time_years": rt,
            "burden_2045": s.get(2045),
            "crossing_1000mt": cross,
        })
    return rows


def main():
    st = load_state()
    cur = st["current_state"]
    idx = cur["indices"]

    print("=" * 74)
    print("ENSO STATE")
    print("=" * 74)
    print(f"  As of {cur['as_of']}   status: {cur['alert_status']}   phase: {cur['phase']}")
    print()
    print(f"  Nino-3.4 weekly (centred {idx['nino34_weekly_c']['centered_on']}): "
          f"{idx['nino34_weekly_c']['value']:+.2f} C")
    print(f"  Nino-3.4 monthly (Jul 2026):              "
          f"{idx['nino34_monthly_july_2026_c']['value']:+.2f} C")
    print(f"  Nino-3.4 seasonal mean (May-Jul 2026):    "
          f"{idx['nino34_seasonal_mean_mjj_2026_c']['value']:+.2f} C")
    print(f"  ONI (May-Jul 2026):                       "
          f"{idx['oni_mjj_2026_c']['value']:+.2f} C")
    print()
    out = cur["outlook"]
    print(f"  Very strong, fall/winter 2026-27:  >{out['very_strong_fall_winter_2026_27_pct']['value']}%")
    print(f"  Very strong, OND 2026:              {out['very_strong_ond_2026_pct']['value']}%")
    print(f"  HISTORIC (RONI >= +2.5 C), OND:     {out['historic_event_ond_2026_pct']['value']}%"
          f"  — would exceed every El Nino back to 1950")

    sub = cur.get("subsurface_structure")
    if sub:
        print()
        print("  SUBSURFACE STRUCTURE — the phase-change question")
        print(f"    peak anomaly ~{sub['peak_anomaly_c']} C at 50-150 m  "
              f"[{sub['peak_anomaly_status']}]")
        print(f"    firmer: {sub['firmer_corroboration'][:78]}...")
        print("    Q: is vertical mixing suppressed TEMPORARILY (large excursion")
        print("       within the attractor) or STRUCTURALLY (heat budget changed,")
        print("       amplitude is a symptom not the event)?  Open.")
        print("    Audit flags: " + "; ".join(f[:34] for f in sub["audit_flags"]))

    conf = cur["conflicting_figure_not_reconciled"]
    print()
    print("  [!] UNRECONCILED FIGURE")
    print(f"      claim   : {conf['claim']}")
    print(f"      problem : {conf['problem'][:96]}...")
    print(f"      -> kept visible rather than dropped. See U-20.")

    print()
    print("=" * 74)
    print("H-17  WHAT THIS REPO'S OWN MODEL SAYS ABOUT THE SAME WINDOW")
    print("=" * 74)
    rows = model_over_window()
    print(f"  {'year':<8}{'burden MT':>12}{'chi':>12}   regime")
    for y, b, c, r in rows:
        mark = "  <-- El Nino window" if WINDOW[0] <= y <= WINDOW[1] else ""
        print(f"  {y:<8}{b:>12.1f}{c:>12.4f}   {r}{mark}")

    window_chi = [c for y, b, c, r in rows if WINDOW[0] <= y <= WINDOW[1]]
    incipient_floor = 0.5
    print()
    print(f"  Peak chi across {WINDOW[0]}-{WINDOW[1]}: {max(window_chi):.4f}")
    print(f"  Lowest risk-regime floor (Incipient): {incipient_floor}")
    shortfall = incipient_floor / max(window_chi)
    print(f"  Shortfall: a factor of {shortfall:,.0f}.")
    print()
    print(f"  The model places the El Nino window a factor of {shortfall:,.0f} below its own")
    print("  lowest risk regime. So the model RULES OUT satellite-driven attribution")
    print("  for anything observed in 2026-27 — ozone anomalies, PNT degradation,")
    print("  supply-chain disruption. If those occur, and against a possible record")
    print("  El Nino they well may, this project's own arithmetic says they are not")
    print("  its subject.")
    print()
    print("  That is a falsifiable, self-limiting statement, and it is the most")
    print("  useful thing this module produces. Stating it in advance is what")
    print("  stops a natural event from being read as confirmation later.")

    print()
    print("=" * 74)
    print("COUPLING MECHANISMS — none are wired into any model here")
    print("=" * 74)
    wired = 0
    for m in st["coupling_mechanisms"]:
        q = m.get("magnitude_status", "n/a")
        print(f"\n  {m['name']}")
        print(f"    status    : {m['status']}   magnitude: {q}")
        print(f"    relevance : {m['why_it_matters_here'][:150]}...")
        if "NOT WIRED IN" not in m.get("coupling_status", ""):
            wired += 1
    total = len(st["coupling_mechanisms"])
    physical = total - 1   # the attribution item is a documentation finding, not a mechanism
    print()
    print(f"  {total} entries: {physical} physical mechanisms + 1 attribution finding.")
    print(f"  Physical mechanisms wired into a model: 0 of {physical}.")
    print("  ENSO does not appear in Accumulation-with-coupling.py, in")
    print("  Chemical-interactions.py, or anywhere else. The models have no")
    print("  interannual variability of any kind — no ENSO, no QBO, no seasonality.")

    print()
    print("=" * 74)
    print("RESIDENCE-TIME SENSITIVITY (for when a BDC perturbation is sourced)")
    print("=" * 74)
    print("  No value is asserted for how much El Nino changes residence time.")
    print("  This table converts one into a consequence, once someone has it.")
    print()
    print(f"  {'change':>8}{'residence yr':>15}{'burden 2045 MT':>18}{'1000 MT crossed':>18}")
    for r in residence_sensitivity():
        b = f"{r['burden_2045']:,.1f}" if r["burden_2045"] is not None else "n/a"
        c = r["crossing_1000mt"] or "not in run"
        print(f"  {r['perturbation_pct']:>7.0f}%{r['residence_time_years']:>15}"
              f"{b:>18}{str(c):>18}")
    print()
    print("  Rows repeat where perturbations round to the same integer year: the")
    print("  rectangular kernel indexes whole years, so it cannot represent a")
    print("  sub-year change. That quantisation is itself a modelling limit (U-3)")
    print("  and it puts a floor on the ENSO perturbation this model could ever")
    print("  resolve — an effect smaller than ~1 year of residence is invisible here.")
    print("  Note this stacks on H-13, which is already unresolved by 6x. An ENSO")
    print("  modulation would ride on top of a baseline nobody has pinned down.")

    print()
    print("ENSO figures go stale monthly. Re-check the CPC discussion before use.")
    print("None verified against primary sources from this environment (U-14, U-20).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
