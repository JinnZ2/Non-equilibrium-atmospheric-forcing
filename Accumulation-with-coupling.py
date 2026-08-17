"""Al2O3 stratospheric burden + electromagnetic coupling coefficient (chi).

This is the reference implementation of the coupling model. Every published
number in `coupling_config.json` is regenerated from this file by
`reproduce.py` — do not hand-edit the projected series.

Supersedes legacy/Aluminum-loading.py, whose accumulation core is reproduced
here (same 30 kg/satellite yield, same cohort-ageing buffer) with the chi term
added. See RESEARCH_LOG.md for the claim/run/result history.
"""

import numpy as np

# --- Model parameters (single source of truth for the projected series) ---
CRITICAL_THRESHOLD_MT = 1000    # burden at which the coupling law changes branch
                                # Speculative — no observational constraint (U-2).

# Residence time: ~5 years, from meteor smoke particle transport literature
# (Plane 2012; Megner et al. 2008). Mesospheric meridional circulation ~2-4 yr
# to the stratosphere, plus ~1-2 yr stratospheric residence. Range 3-10 yr.
#
# CONTESTED. Ferreira et al. (2024) — the source of the 30 kg/satellite yield
# used just below — describes Al2O3 reentry products taking *up to 30 years* to
# settle from the top of the mesosphere into the ozone layer, a 6x disagreement
# with the value used here. Measured effect is smaller than that gap implies:
# under 15%/yr growth it moves the 2045 burden ~1.9x and the 1,000 MT crossing
# by 4 years, because recent cohorts dominate. Not silently resolved: see
# RESEARCH_LOG.md H-13, and `python reproduce.py` reports both side by side.
RESIDENCE_TIME_YEARS = 5
RESIDENCE_TIME_ALT_YEARS = 30   # the contested alternative, reported alongside

BASE_REENTRIES_PER_YEAR = 730   # 2024 baseline burn-rate
AL2O3_KG_PER_SATELLITE = 30     # Al2O3 yield per reentering satellite
                                # Sourced: Ferreira et al. 2024 (250 kg satellite)
GROWTH_RATE = 0.15              # annual increase in satellite mass reentry
SOLAR_ACTIVITY_INDEX = 1.2      # Solar Cycle 25/26
START_YEAR = 2025


def calculate_coupling_coefficient(burden_mt, solar_activity_index=1.0):
    """
    Calculates the 'Blind Spot' risk: EM Coupling.
    burden_mt: Total metric tons of Al2O3 in the stratosphere.
    solar_activity_index: 1.0 (baseline) to 5.0 (Extreme solar max).

    NOTE: this function is piecewise and is NOT continuous at burden_mt =
    CRITICAL_THRESHOLD_MT. chi jumps by a factor of 1.60 across that point
    (1.20 -> 1.92 at the default solar index). The apparent "phase
    transition" in the output series is produced by that discontinuity, not
    by modelled physics. Left in place deliberately — see RESEARCH_LOG.md
    H-04. Do not smooth it without replacing the underlying law.
    """
    # Threshold: estimated mass at which conductivity changes become
    # significant. Speculative; no observational constraint exists yet (U-2).
    critical_threshold = CRITICAL_THRESHOLD_MT

    # Nonlinear scaling: Risk increases quadratically once threshold is crossed
    if burden_mt < critical_threshold:
        coupling_factor = (burden_mt / critical_threshold) ** 2
    else:
        # Cascade regime: Exponential growth of coupling
        coupling_factor = 1 + np.log10(burden_mt / critical_threshold + 1) * 2

    # The actual 'Coupling Coefficient' (Risk of induced currents/Ozone destruction)
    chi = coupling_factor * solar_activity_index
    return chi


def risk_level(chi):
    """Regime label for a coupling coefficient.

    Boundaries match `risk_thresholds` in coupling_config.json. The
    Pre-Cascade band (3.0-5.0) exists because the original config set the
    cascade floor at 5.0 while this code labelled cascade at 3.0, leaving
    3.0-5.0 unassigned — see RESEARCH_LOG.md H-05.
    """
    if chi < 0.5:
        return "Nominal"
    elif chi < 1.5:
        return "Incipient Coupling"
    elif chi < 3.0:
        return "Systemic Fragility"
    elif chi < 5.0:
        return "Pre-Cascade"
    else:
        return "CASCADE FAILURE"


def run(years_to_run=20,
        growth_rate=GROWTH_RATE,
        base_reentries=BASE_REENTRIES_PER_YEAR,
        kg_per_satellite=AL2O3_KG_PER_SATELLITE,
        solar_activity_index=SOLAR_ACTIVITY_INDEX,
        residence_time=RESIDENCE_TIME_YEARS,
        start_year=START_YEAR):
    """Yield (year, burden_mt, chi, regime) for each simulated year."""
    active_particles = np.zeros(int(residence_time))

    for year in range(years_to_run):
        # New injection logic
        annual_injection = (
            base_reentries * ((1 + growth_rate) ** year) * kg_per_satellite
        ) / 1000
        active_particles[0] += annual_injection
        burden = np.sum(active_particles)

        chi = calculate_coupling_coefficient(burden, solar_activity_index)

        yield start_year + year, burden, chi, risk_level(chi)

        # Age the cohorts: shift right, oldest falls off the end.
        active_particles[1:] = active_particles[:-1]
        active_particles[0] = 0


if __name__ == "__main__":
    print(f"{'Year':<6} | {'Al Burden (MT)':<15} | {'Coupling Coeff (χ)':<20} | {'Risk Level'}")
    print("-" * 60)
    for current_year, burden, chi, status in run(years_to_run=20):
        print(f"{current_year:<6} | {burden:<15.2f} | {chi:<20.2f} | {status}")
