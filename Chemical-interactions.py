"""
Chemical-interactions.py — Upper Atmosphere Heterogeneous Chemistry Model

Models the catalytic interactions between Al2O3 nanoparticles from satellite
reentry, stratospheric aerosol injection (SAI) proposals, and existing
ozone-depleting chemical cycles.

Key reactions modeled:
  1. Al2O3 heterogeneous catalysis of O3 destruction
  2. Al2O3 + SO2 synergy (if SAI is deployed alongside satellite reentry)
  3. NOx production from energetic particle precipitation (EPP)
  4. ClOx/BrOx interactions with metallic aerosol surfaces

References:
  - Rossi (2003) Chemical Reviews 103(12) — heterogeneous reactions on oxide surfaces
  - Solomon (1999) Reviews of Geophysics 37(3) — stratospheric ozone depletion
  - Cziczo et al. (2001) JGR 106(D10) — meteoric material in stratosphere
  - Jackman et al. (2005) JGR 110(D9) — NOx from solar proton events
  - Murphy et al. (2023) PNAS 120(43) — satellite metals in stratospheric aerosol

Confidence levels:
  - Al2O3 catalysis of O3: MEDIUM (mechanism established, rates uncertain for nano-Al2O3)
  - SO2 + Al2O3 synergy: MEDIUM-LOW (plausible from surface chemistry, not measured in situ)
  - EPP → NOx → O3 loss: HIGH (well-observed, e.g. after solar proton events)
  - ClOx on metallic surfaces: LOW (speculative extension of known heterogeneous chemistry)
"""

import numpy as np


# ============================================================
# Physical constants and baseline parameters
# ============================================================

AVOGADRO = 6.022e23                  # molecules/mol
O3_COLUMN_BASELINE_DU = 300.0        # Dobson Units, global mean
DU_TO_MOLECULES_CM2 = 2.687e16       # molecules/cm² per DU

# Al2O3 particle properties
AL2O3_DENSITY = 3.95e3               # kg/m³
PARTICLE_DIAMETER_M = 50e-9          # 50 nm typical
PARTICLE_RADIUS_M = PARTICLE_DIAMETER_M / 2
PARTICLE_VOLUME_M3 = (4/3) * np.pi * PARTICLE_RADIUS_M**3
PARTICLE_MASS_KG = AL2O3_DENSITY * PARTICLE_VOLUME_M3
PARTICLE_SURFACE_M2 = 4 * np.pi * PARTICLE_RADIUS_M**2

# Catalytic rate constants (heterogeneous, on Al2O3 surfaces)
# gamma = reaction probability per collision with surface
# Range from Rossi (2003) for metal oxide surfaces
GAMMA_O3_ON_AL2O3 = 1e-5             # O3 uptake coefficient (conservative)
GAMMA_O3_ON_AL2O3_RANGE = (1e-6, 1e-4)

# SO2 interaction — enhances surface reactivity
# When SO2 adsorbs on Al2O3, it creates sulfate sites that
# are more reactive toward O3 (acid-catalyzed decomposition)
SO2_ENHANCEMENT_FACTOR = 2.5         # multiplicative factor on gamma when SO2 present
SO2_ENHANCEMENT_RANGE = (1.5, 5.0)   # uncertainty range

# ClOx heterogeneous activation on metallic surfaces
# By analogy with PSC (polar stratospheric cloud) chemistry
# where HCl + ClONO2 → Cl2 + HNO3 on ice/NAT surfaces
GAMMA_CLONO2_ON_AL2O3 = 1e-3        # higher than ice, lower than NAT
GAMMA_CLONO2_RANGE = (1e-4, 1e-2)


def particle_number_density(burden_mt, residence_years=5.0,
                            altitude_range_km=(50, 85)):
    """
    Estimate particle number density from total atmospheric burden.

    Args:
        burden_mt: Total Al2O3 burden in metric tons
        residence_years: Atmospheric residence time (not used directly here,
                        burden already accounts for it)
        altitude_range_km: Altitude range for distribution (mesosphere)

    Returns:
        n_particles: number density in particles/m³
    """
    burden_kg = burden_mt * 1000
    n_total = burden_kg / PARTICLE_MASS_KG

    # Distribute over mesospheric shell
    R_earth = 6.371e6  # meters
    alt_low, alt_high = altitude_range_km
    r_low = R_earth + alt_low * 1e3
    r_high = R_earth + alt_high * 1e3
    volume_m3 = (4/3) * np.pi * (r_high**3 - r_low**3)

    return n_total / volume_m3


def surface_area_density(n_particles):
    """
    Total particle surface area per unit volume (cm²/cm³).
    This is the key parameter for heterogeneous chemistry.
    """
    # Convert from m² per m³ to cm² per cm³ (same numerically)
    return n_particles * PARTICLE_SURFACE_M2  # m²/m³ = cm²/cm³ × 1e-6...
    # Actually: n [1/m³] × A [m²] = m²/m³ = 1e-4 cm²/cm³ × 1e6 = 1e2
    # Let's be careful:
    # n_particles is in /m³, PARTICLE_SURFACE_M2 is in m²
    # product is m²/m³ = m⁻¹
    # To convert to cm²/cm³: multiply by (100 cm/m)² / (100 cm/m)³ = 1/100
    # So: S [cm²/cm³] = n [/m³] × A [m²] / 100


def surface_area_density_cgs(n_particles):
    """Total particle surface area density in cm²/cm³ (CGS for chemistry)."""
    return n_particles * PARTICLE_SURFACE_M2 / 100.0


def o3_loss_rate_heterogeneous(n_particles, o3_concentration_cm3,
                               temperature_K=220.0, with_so2=False):
    """
    Calculate O3 loss rate from heterogeneous reaction on Al2O3 surfaces.

    Uses standard heterogeneous chemistry formulation:
        Loss_rate = (1/4) × gamma × v_thermal × S_area × [O3]

    where v_thermal is the mean molecular speed of O3.

    Args:
        n_particles: particle number density (particles/m³)
        o3_concentration_cm3: O3 number density (molecules/cm³)
        temperature_K: temperature in Kelvin
        with_so2: whether SO2 is present (SAI scenario)

    Returns:
        loss_rate: O3 loss rate in molecules/cm³/s
    """
    # Mean molecular speed of O3 (48 g/mol)
    m_o3 = 48e-3 / AVOGADRO  # kg per molecule
    v_thermal = np.sqrt(8 * 1.381e-23 * temperature_K / (np.pi * m_o3))
    v_thermal_cm = v_thermal * 100  # convert m/s to cm/s

    S_area = surface_area_density_cgs(n_particles)  # cm²/cm³

    gamma = GAMMA_O3_ON_AL2O3
    if with_so2:
        gamma *= SO2_ENHANCEMENT_FACTOR

    # Standard heterogeneous loss rate formula
    loss_rate = 0.25 * gamma * v_thermal_cm * S_area * o3_concentration_cm3

    return loss_rate


def o3_loss_rate_epp_nox(kp_index=3.0, solar_proton_flux=0.0):
    """
    Estimate NOx-mediated O3 loss from energetic particle precipitation.

    EPP produces NOx in the mesosphere/upper stratosphere, which then
    descends and catalytically destroys O3 via:
        NO + O3 → NO2 + O2
        NO2 + O → NO + O2
        Net: O3 + O → 2O2

    Based on Jackman et al. (2005) and Randall et al. (2007).

    Args:
        kp_index: Geomagnetic activity index (0-9). Kp=3 is moderate.
        solar_proton_flux: Solar proton flux > 10 MeV in pfu (particle flux units)

    Returns:
        nox_production_rate: NOx production in molecules/cm³/s (mesosphere)
        o3_loss_du_per_year: Estimated annual O3 column loss in DU
    """
    # Baseline NOx production from galactic cosmic rays
    # ~1-5 × 10³ molecules/cm³/s in mesosphere (Jackman et al.)
    gcr_nox = 2e3  # molecules/cm³/s

    # Geomagnetic storm enhancement (auroral particle precipitation)
    # Kp scaling: roughly exponential
    storm_nox = gcr_nox * 10**((kp_index - 3) / 2)

    # Solar proton events (SPE) — episodic, very large NOx production
    # Major SPE (>1000 pfu) can produce 10⁷ molecules/cm³/s
    if solar_proton_flux > 10:
        spe_nox = 1e4 * np.sqrt(solar_proton_flux)
    else:
        spe_nox = 0.0

    total_nox = gcr_nox + storm_nox + spe_nox

    # O3 loss from NOx: rough conversion
    # After October 2003 SPE: ~10% O3 loss in upper stratosphere for ~60 DU
    # Scale linearly with NOx production relative to that event
    # Oct 2003 SPE peak flux: ~30,000 pfu, produced ~6 × 10⁷ NOx/cm³/s
    reference_nox = 6e7  # Oct 2003 SPE
    reference_o3_loss = 6.0  # DU lost from that event over following months
    o3_loss_du_per_year = reference_o3_loss * (total_nox / reference_nox)

    return total_nox, o3_loss_du_per_year


def clox_activation_rate(n_particles, clono2_cm3, temperature_K=195.0):
    """
    Chlorine activation on Al2O3 surfaces (by analogy with PSC chemistry).

    ClONO2 + HCl → Cl2 + HNO3 (on Al2O3 surface)

    This converts reservoir chlorine (ClONO2, HCl) to active Cl2,
    which photolyzes to Cl atoms that destroy ozone catalytically.

    CONFIDENCE: LOW — This is an extrapolation from PSC chemistry.
    Al2O3 surfaces may or may not support this reaction efficiently.

    Args:
        n_particles: Al2O3 particle number density (particles/m³)
        clono2_cm3: ClONO2 concentration (molecules/cm³)
        temperature_K: temperature (K)

    Returns:
        activation_rate: Cl2 production rate (molecules/cm³/s)
    """
    m_clono2 = 97.5e-3 / AVOGADRO
    v_thermal_cm = np.sqrt(8 * 1.381e-23 * temperature_K / (np.pi * m_clono2)) * 100

    S_area = surface_area_density_cgs(n_particles)

    activation_rate = 0.25 * GAMMA_CLONO2_ON_AL2O3 * v_thermal_cm * S_area * clono2_cm3
    return activation_rate


def simulate_chemical_coupling(years=20, al2o3_injection_mt_yr=22.0,
                               launch_growth_rate=0.15, residence_time=5,
                               sai_deployed=False, sai_start_year=2030,
                               sai_so2_mt_yr=5e6):
    """
    Run integrated chemical interaction simulation.

    Args:
        years: simulation duration
        al2o3_injection_mt_yr: baseline Al2O3 injection (MT/year)
        launch_growth_rate: annual growth rate of satellite reentries
        residence_time: atmospheric residence time (years)
        sai_deployed: whether SAI (SO2 injection) begins
        sai_start_year: when SAI starts
        sai_so2_mt_yr: SO2 injection rate (MT/year) if SAI deployed

    Returns:
        results: dict of time series
    """
    # Track atmospheric burden with residence time buffer
    active_particles = np.zeros(residence_time)

    results = {
        'year': [], 'burden_mt': [], 'n_particles_m3': [],
        'o3_loss_catalytic_du_yr': [], 'o3_loss_epp_du_yr': [],
        'o3_column_du': [], 'total_o3_loss_du_yr': [],
        'so2_present': []
    }

    o3_column = O3_COLUMN_BASELINE_DU

    for yr in range(years):
        current_year = 2025 + yr

        # Annual injection with growth
        injection = al2o3_injection_mt_yr * (1 + launch_growth_rate)**yr
        active_particles[0] += injection
        burden = np.sum(active_particles)

        # Particle number density
        n_part = particle_number_density(burden)

        # Is SO2 present (SAI deployed)?
        so2_present = sai_deployed and current_year >= sai_start_year

        # O3 loss from heterogeneous catalysis on Al2O3
        # Use representative mesospheric O3: ~10¹² molecules/cm³
        o3_conc = 1e12  # molecules/cm³ (mesospheric)
        loss_rate = o3_loss_rate_heterogeneous(n_part, o3_conc, with_so2=so2_present)

        # Convert loss rate to DU/year (very rough)
        # Integrate over mesospheric column (~35 km = 3.5e6 cm)
        # DU = molecules/cm² / 2.687e16
        seconds_per_year = 3.156e7
        column_loss = loss_rate * 3.5e6 * seconds_per_year  # molecules/cm²/year
        o3_loss_cat_du = column_loss / DU_TO_MOLECULES_CM2

        # O3 loss from EPP-NOx (assume moderate solar activity)
        # Solar cycle modulation: peak around 2025 (cycle 25), 2036 (cycle 26)
        cycle_phase = np.sin(2 * np.pi * (current_year - 2025) / 11)
        kp_mean = 3.0 + 2.0 * max(0, cycle_phase)  # Kp 3-5 near solar max
        _, o3_loss_epp_du = o3_loss_rate_epp_nox(kp_index=kp_mean)

        total_loss = o3_loss_cat_du + o3_loss_epp_du
        o3_column = max(100, o3_column - total_loss)  # floor at 100 DU

        # Store results
        results['year'].append(current_year)
        results['burden_mt'].append(burden)
        results['n_particles_m3'].append(n_part)
        results['o3_loss_catalytic_du_yr'].append(o3_loss_cat_du)
        results['o3_loss_epp_du_yr'].append(o3_loss_epp_du)
        results['o3_column_du'].append(o3_column)
        results['total_o3_loss_du_yr'].append(total_loss)
        results['so2_present'].append(so2_present)

        # Age particles
        active_particles[1:] = active_particles[:-1]
        active_particles[0] = 0

    return results


# ============================================================
# Run simulation
# ============================================================
if __name__ == "__main__":
    print("=" * 80)
    print("SCENARIO 1: Satellite reentry only (no SAI)")
    print("=" * 80)
    r1 = simulate_chemical_coupling(years=25, sai_deployed=False)

    print(f"{'Year':<6} | {'Burden MT':<10} | {'Cat O3 loss':<12} | {'EPP O3 loss':<12} | {'O3 Column':<10} | {'SO2?'}")
    print("-" * 70)
    for i in range(len(r1['year'])):
        print(f"{r1['year'][i]:<6} | {r1['burden_mt'][i]:<10.1f} | "
              f"{r1['o3_loss_catalytic_du_yr'][i]:<12.4f} | "
              f"{r1['o3_loss_epp_du_yr'][i]:<12.4f} | "
              f"{r1['o3_column_du'][i]:<10.1f} | "
              f"{'Yes' if r1['so2_present'][i] else 'No'}")

    print()
    print("=" * 80)
    print("SCENARIO 2: Satellite reentry + SAI deployed in 2030")
    print("=" * 80)
    r2 = simulate_chemical_coupling(years=25, sai_deployed=True, sai_start_year=2030)

    print(f"{'Year':<6} | {'Burden MT':<10} | {'Cat O3 loss':<12} | {'EPP O3 loss':<12} | {'O3 Column':<10} | {'SO2?'}")
    print("-" * 70)
    for i in range(len(r2['year'])):
        print(f"{r2['year'][i]:<6} | {r2['burden_mt'][i]:<10.1f} | "
              f"{r2['o3_loss_catalytic_du_yr'][i]:<12.4f} | "
              f"{r2['o3_loss_epp_du_yr'][i]:<12.4f} | "
              f"{r2['o3_column_du'][i]:<10.1f} | "
              f"{'Yes' if r2['so2_present'][i] else 'No'}")

    print()
    print("KEY FINDING: SAI + satellite reentry synergy")
    final_no_sai = r2['o3_column_du'][-1]
    final_with_sai = r1['o3_column_du'][-1]
    print(f"  O3 column in 2049 without SAI: {final_with_sai:.1f} DU")
    print(f"  O3 column in 2049 with SAI:    {final_no_sai:.1f} DU")
    print(f"  Additional O3 loss from synergy: {final_with_sai - final_no_sai:.2f} DU")
