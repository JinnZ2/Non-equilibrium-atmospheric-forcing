"""Al2O3 stratospheric burden + electromagnetic coupling coefficient (chi).

This is the reference implementation of the coupling model. Every published
number in `coupling_config.json` is regenerated from this file by
`reproduce.py` — do not hand-edit the projected series.

Supersedes legacy/Aluminum-loading.py, whose accumulation core is reproduced
here (same 30 kg/satellite, same 30-year residence buffer) with the chi term
added. See RESEARCH_LOG.md for the claim/run/result history.
"""

import numpy as np

# --- Model parameters (single source of truth for the projected series) ---
CRITICAL_THRESHOLD_MT = 1000    # burden at which the coupling law changes branch
RESIDENCE_TIME_YEARS = 30       # particles age out of the buffer after this long
BASE_REENTRIES_PER_YEAR = 500   # 2025 baseline burn-rate
AL2O3_KG_PER_SATELLITE = 30     # Al2O3 nanoparticle yield per reentering satellite
GROWTH_RATE = 0.18              # annual increase in satellite mass reentry
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
    # Threshold: Research suggests ~1,000 metric tons starts changing
    # the conductivity of the mesosphere significantly.
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

    Boundaries match `risk_thresholds` in coupling_config.json, where each
    regime's chi_max is the next regime's floor.
    """
    if chi < 0.5:
        return "Nominal"
    elif chi < 1.5:
        return "Incipient Coupling"
    elif chi < 3.0:
        return "Systemic Fragility"
    else:
        return "CASCADE FAILURE"


def run(years_to_run=20,
        growth_rate=GROWTH_RATE,
        base_reentries=BASE_REENTRIES_PER_YEAR,
        kg_per_satellite=AL2O3_KG_PER_SATELLITE,
        solar_activity_index=SOLAR_ACTIVITY_INDEX,
        start_year=START_YEAR):
    """Yield (year, burden_mt, chi, regime) for each simulated year."""
    active_particles = np.zeros(RESIDENCE_TIME_YEARS)

    for year in range(years_to_run):
        # New injection logic
        annual_injection = (
            base_reentries * ((1 + growth_rate) ** year) * kg_per_satellite
        ) / 1000
        active_particles[0] += annual_injection
        burden = np.sum(active_particles)

        chi = calculate_coupling_coefficient(burden, solar_activity_index)

        yield start_year + year, burden, chi, risk_level(chi)

        active_particles = np.roll(active_particles, 1)
        active_particles[0] = 0


if __name__ == "__main__":
    print(f"{'Year':<6} | {'Al Burden (MT)':<15} | {'Coupling Coeff (χ)':<20} | {'Risk Level'}")
    print("-" * 60)
    for current_year, burden, chi, status in run(years_to_run=20):
        print(f"{current_year:<6} | {burden:<15.2f} | {chi:<20.2f} | {status}")
