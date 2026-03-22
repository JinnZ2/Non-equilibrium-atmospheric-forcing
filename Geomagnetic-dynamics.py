"""
Geomagnetic-dynamics.py — Earth's Magnetic Field Evolution and Coupling Model

Models the weakening geomagnetic field, South Atlantic Anomaly (SAA) growth,
geomagnetic jerks, and their coupling to energetic particle precipitation (EPP)
rates — which in turn interact with the Al2O3 particle layer.

The causal chain:
  Inner Earth geodynamo → Field weakening → Reduced shielding →
  Increased EPP → Enhanced ionization of particle-laden mesosphere →
  Modified atmospheric conductivity → Coupling with space weather

Key physics:
  1. Dipole moment secular decline (~5% per century, accelerating)
  2. South Atlantic Anomaly — region of anomalously weak field
  3. Geomagnetic jerks — sudden changes in secular variation
  4. Radiation belt particle precipitation modulated by field strength

References:
  - Finlay et al. (2010) GJI — International Geomagnetic Reference Field (IGRF)
  - Pavón-Carrasco & De Santis (2016) Frontiers — geomagnetic field for last 3000 yr
  - Heirtzler (2002) Physics of the Earth — South Atlantic Anomaly
  - Mandea et al. (2010) Space Science Reviews — geomagnetic jerks
  - Abel & Thorne (1998) JGR — radiation belt precipitation
  - Clilverd et al. (2009) JGR — EPP effects on middle atmosphere

Confidence levels:
  - Dipole decay rate: HIGH (directly measured since 1840, archaeomagnetic data earlier)
  - SAA growth: HIGH (satellite measurements since 1960s)
  - Geomagnetic jerks: HIGH occurrence, LOW predictability
  - EPP-field coupling: MEDIUM-HIGH (observed, modeled)
  - EPP-Al2O3 interaction: LOW (speculative coupling)
"""

import numpy as np


# ============================================================
# Geomagnetic field parameters
# ============================================================

# Current dipole moment and its rate of change
DIPOLE_MOMENT_2020 = 7.94e22  # A⋅m², from IGRF-13
DIPOLE_MOMENT_1900 = 8.32e22  # A⋅m²
DIPOLE_DECAY_RATE = -0.05     # fractional per century (-5%/century)
# Accelerating: was ~3.5%/century in 1900, ~5-6%/century now

# Reference field strength at Earth's surface (equator)
B_EQUATOR_2020 = 30.0e-6     # Tesla (~30 μT at equator, ~60 μT at poles)
B_DIPOLE_REFERENCE = 50.0e-6  # μT, historical average for shielding calcs

# South Atlantic Anomaly parameters
SAA_CENTER_LON_2020 = -45.0   # degrees (over South America/South Atlantic)
SAA_CENTER_LAT_2020 = -25.0   # degrees
SAA_DRIFT_RATE_LON = -0.3     # degrees/year (westward drift)
SAA_DRIFT_RATE_LAT = -0.1     # degrees/year (slight southward drift)
SAA_GROWTH_RATE = 0.07        # fractional area growth per decade
SAA_MIN_FIELD_FRACTION = 0.55  # minimum field as fraction of expected dipole

# Geomagnetic jerk parameters
# Jerks are sudden changes in the second time derivative of the field
# They occur irregularly, roughly every 5-15 years
JERK_MEAN_INTERVAL_YR = 10.0
JERK_AMPLITUDE_NT_YR2 = 5.0   # typical amplitude in nT/yr²


def dipole_moment(year):
    """
    Model the geomagnetic dipole moment evolution.

    Uses a quadratic fit to historical data (Pavón-Carrasco & De Santis, 2016)
    with the observed acceleration in decay rate.

    Args:
        year: calendar year

    Returns:
        M: dipole moment in A⋅m²
    """
    dt = (year - 2020) / 100.0  # time in centuries from 2020

    # Quadratic model: decay is accelerating
    # M(t) = M_2020 × (1 + a₁t + a₂t²)
    # a₁ = -0.05/century (current rate)
    # a₂ = -0.01/century² (acceleration of decay)
    a1 = DIPOLE_DECAY_RATE
    a2 = -0.01  # slight acceleration

    M = DIPOLE_MOMENT_2020 * (1 + a1 * dt + a2 * dt**2)
    return max(M, 0)  # can't go negative


def field_strength_at_surface(year, latitude_deg=0.0):
    """
    Estimate surface field strength from dipole model.

    B = (μ₀/4π) × M/R³ × sqrt(1 + 3sin²λ)

    Args:
        year: calendar year
        latitude_deg: geographic latitude in degrees

    Returns:
        B: field strength in Tesla
    """
    M = dipole_moment(year)
    M_ratio = M / DIPOLE_MOMENT_2020

    lat_rad = np.radians(latitude_deg)
    angular_factor = np.sqrt(1 + 3 * np.sin(lat_rad)**2)

    # Scale from 2020 equatorial value
    B = B_EQUATOR_2020 * M_ratio * angular_factor
    return B


def saa_field_strength(year):
    """
    Field strength at the South Atlantic Anomaly minimum.

    The SAA is deepening as the dipole weakens and non-dipole
    contributions evolve. The minimum field in the SAA is currently
    ~55% of the expected dipole value and declining.

    Args:
        year: calendar year

    Returns:
        B_min: minimum field strength in the SAA (Tesla)
        area_fraction: fraction of Earth's surface covered by SAA
    """
    dt = (year - 2020)

    # SAA minimum field: declining faster than the global dipole
    saa_extra_decline = 0.005  # additional 0.5%/decade beyond dipole trend
    saa_fraction = SAA_MIN_FIELD_FRACTION * (1 - saa_extra_decline * dt / 10)
    saa_fraction = max(saa_fraction, 0.2)  # floor

    B_expected = field_strength_at_surface(year, latitude_deg=SAA_CENTER_LAT_2020)
    B_min = B_expected * saa_fraction

    # SAA area growth: currently ~7% per decade
    area_2020 = 0.05  # ~5% of Earth's surface
    area = area_2020 * (1 + SAA_GROWTH_RATE * dt / 10)
    area = min(area, 0.30)  # cap at 30% of surface

    return B_min, area


def shielding_efficiency(year, latitude_deg=0.0):
    """
    Magnetospheric shielding efficiency against solar wind/cosmic rays.

    η = (B/B_ref)^α where α ≈ 1.5-2.0

    This determines how much solar wind energy penetrates to the
    mesosphere via energetic particle precipitation.

    Args:
        year: calendar year
        latitude_deg: latitude

    Returns:
        eta: shielding efficiency (0 to 1)
    """
    B = field_strength_at_surface(year, latitude_deg)
    alpha = 1.7  # shielding exponent (between 1.5-2.0)

    eta = (B / B_DIPOLE_REFERENCE) ** alpha
    return min(eta, 1.0)


def epp_flux_enhancement(year, kp_index=3.0, latitude_deg=65.0):
    """
    Energetic particle precipitation flux relative to 2020 baseline.

    As the field weakens, radiation belt particles precipitate more easily.
    The enhancement is strongest at high latitudes (auroral zone) and in the SAA.

    The key coupling: more EPP → more ionization in mesosphere →
    more interaction with Al2O3 particle layer → enhanced conductivity.

    Args:
        year: calendar year
        kp_index: geomagnetic activity index (0-9)
        latitude_deg: latitude (EPP strongest at ~65° auroral zone)

    Returns:
        enhancement: multiplicative factor relative to 2020 baseline
    """
    eta_now = shielding_efficiency(year, latitude_deg)
    eta_2020 = shielding_efficiency(2020, latitude_deg)

    # EPP scales inversely with shielding
    if eta_now > 0.01:
        base_enhancement = eta_2020 / eta_now
    else:
        base_enhancement = 100.0  # cap

    # Geomagnetic storm enhancement
    # Kp scaling: EPP increases roughly 10× per 3 Kp units above quiet
    storm_factor = 10 ** ((kp_index - 2) / 3)

    return base_enhancement * storm_factor


def generate_geomagnetic_jerks(years, seed=42):
    """
    Generate a stochastic sequence of geomagnetic jerks.

    Jerks are sudden changes in the second derivative of field evolution.
    They create transient windows of enhanced vulnerability where the
    field changes rapidly.

    Args:
        years: array of years
        seed: random seed for reproducibility

    Returns:
        jerk_signal: additive perturbation to field rate of change (nT/yr)
    """
    rng = np.random.default_rng(seed)
    n = len(years)
    jerk_signal = np.zeros(n)

    # Generate jerk occurrence times (Poisson process)
    t = 0
    while t < n:
        interval = rng.exponential(JERK_MEAN_INTERVAL_YR)
        t += interval
        if t < n:
            idx = int(t)
            # Jerk amplitude (random sign and magnitude)
            amplitude = rng.normal(0, JERK_AMPLITUDE_NT_YR2)
            # Apply as a step change in rate, decaying over ~2-3 years
            for j in range(min(5, n - idx)):
                jerk_signal[idx + j] += amplitude * np.exp(-j / 2.0)

    return jerk_signal


def simulate_geomagnetic_evolution(years=30, include_jerks=True):
    """
    Run geomagnetic field evolution simulation with coupling metrics.

    Returns time series of field strength, shielding, SAA extent,
    and EPP enhancement factors.

    Args:
        years: simulation duration from 2025
        include_jerks: whether to include stochastic geomagnetic jerks

    Returns:
        results: dict of time series
    """
    year_array = np.arange(2025, 2025 + years)

    results = {
        'year': year_array.tolist(),
        'dipole_moment_fraction': [],
        'equatorial_field_uT': [],
        'saa_min_field_uT': [],
        'saa_area_fraction': [],
        'shielding_equator': [],
        'shielding_auroral': [],
        'epp_enhancement_auroral': [],
        'epp_enhancement_saa': [],
    }

    # Generate jerk perturbations
    if include_jerks:
        jerks = generate_geomagnetic_jerks(year_array)
    else:
        jerks = np.zeros(years)

    for i, yr in enumerate(year_array):
        # Dipole moment
        M = dipole_moment(yr)
        M_frac = M / DIPOLE_MOMENT_2020

        # Equatorial field (add jerk perturbation)
        B_eq = field_strength_at_surface(yr, 0.0)
        B_eq += jerks[i] * 1e-9  # jerks are in nT

        # SAA
        B_saa, saa_area = saa_field_strength(yr)

        # Shielding
        eta_eq = shielding_efficiency(yr, 0.0)
        eta_aur = shielding_efficiency(yr, 65.0)

        # EPP enhancement (moderate solar activity, Kp=3)
        epp_aur = epp_flux_enhancement(yr, kp_index=3.0, latitude_deg=65.0)
        epp_saa = epp_flux_enhancement(yr, kp_index=3.0, latitude_deg=SAA_CENTER_LAT_2020)

        results['dipole_moment_fraction'].append(M_frac)
        results['equatorial_field_uT'].append(B_eq * 1e6)
        results['saa_min_field_uT'].append(B_saa * 1e6)
        results['saa_area_fraction'].append(saa_area)
        results['shielding_equator'].append(eta_eq)
        results['shielding_auroral'].append(eta_aur)
        results['epp_enhancement_auroral'].append(epp_aur)
        results['epp_enhancement_saa'].append(epp_saa)

    return results


# ============================================================
# Run simulation
# ============================================================
if __name__ == "__main__":
    results = simulate_geomagnetic_evolution(years=30)

    print("Geomagnetic Field Evolution and Coupling Metrics")
    print("=" * 95)
    print(f"{'Year':<6} | {'Dipole %':<9} | {'B_eq (μT)':<10} | {'SAA min':<9} | "
          f"{'SAA area':<9} | {'Shield_eq':<10} | {'EPP_aur':<8} | {'EPP_SAA':<8}")
    print("-" * 95)

    for i in range(len(results['year'])):
        yr = results['year'][i]
        if yr % 5 == 0 or i == 0:  # Print every 5 years
            print(f"{yr:<6} | "
                  f"{results['dipole_moment_fraction'][i]*100:<9.1f} | "
                  f"{results['equatorial_field_uT'][i]:<10.2f} | "
                  f"{results['saa_min_field_uT'][i]:<9.2f} | "
                  f"{results['saa_area_fraction'][i]*100:<8.1f}% | "
                  f"{results['shielding_equator'][i]:<10.3f} | "
                  f"{results['epp_enhancement_auroral'][i]:<8.2f} | "
                  f"{results['epp_enhancement_saa'][i]:<8.2f}")

    print()
    print("KEY OBSERVATIONS:")
    print(f"  Dipole strength 2025: {results['dipole_moment_fraction'][0]*100:.1f}% of 2020")
    print(f"  Dipole strength 2054: {results['dipole_moment_fraction'][-1]*100:.1f}% of 2020")
    print(f"  SAA area 2025: {results['saa_area_fraction'][0]*100:.1f}% of surface")
    print(f"  SAA area 2054: {results['saa_area_fraction'][-1]*100:.1f}% of surface")
    print(f"  EPP enhancement (auroral) by 2054: {results['epp_enhancement_auroral'][-1]:.1f}× baseline")
    print(f"  EPP enhancement (SAA) by 2054: {results['epp_enhancement_saa'][-1]:.1f}× baseline")
    print()
    print("NOTE: Geomagnetic jerks add stochastic variation. Individual years may")
    print("show transient vulnerability windows with enhanced EPP penetration.")
