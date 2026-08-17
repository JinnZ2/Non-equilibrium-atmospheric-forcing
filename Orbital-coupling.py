"""
Orbital-coupling.py — Orbital Interactions and Atmospheric Forcing

Models three classes of orbital interaction that modify the atmospheric
environment for the Al2O3 particle layer:

  1. COMETARY DUST AND METEOR SHOWERS
     Comets shed dust that creates meteor showers. This deposits additional
     metallic material (Fe, Ni, Mg, Si oxides) into the mesosphere,
     supplementing satellite-derived Al2O3. Major showers add ~40-100 tons/day
     of meteoric material globally.
     CONFIDENCE: HIGH — well-observed, well-modeled (Plane, 2012)

  2. CLOSE GRAVITATIONAL PASSES (comets/asteroids near Earth)
     A comet or asteroid passing between Earth and Moon (<384,400 km).
     Gravitational effects: negligible for objects <10 km diameter.
     Atmospheric effects: cometary outgassing and dust tail could deposit
     material directly. Tidal effects on magnetosphere are tiny but
     calculable for very close passes.
     CONFIDENCE: LOW for gravitational — MEDIUM for dust deposition from tail

  3. SOLAR GEOMETRY AND HELIOSPHERIC POSITION
     Earth's orbital position affects solar wind exposure, CME impact
     probability, and galactic cosmic ray flux. The ~11-year solar cycle
     dominates, but orbital eccentricity, heliospheric current sheet tilt,
     and galactic cosmic ray modulation also contribute.
     CONFIDENCE: HIGH — standard space weather physics

References:
  - Plane (2012) Chemical Society Reviews — cosmic dust in Earth's atmosphere
  - Ceplecha et al. (1998) Space Science Reviews — meteor phenomena
  - Jenniskens (2006) "Meteor Showers and their Parent Comets" (Cambridge)
  - Usoskin (2017) Living Reviews in Solar Physics — solar activity
  - Jokipii & Thomas (1981) ApJ — cosmic ray modulation
  - Yeomans (2013) "Near-Earth Objects" — close approaches
"""

import numpy as np


# ============================================================
# 1. COMETARY DUST AND METEOR SHOWERS
# ============================================================

# Global meteoric input: ~30-100 tons/day (Plane, 2012; Love & Brownlee, 1993)
# This is the BACKGROUND flux, mostly from sporadic meteors
DAILY_METEORIC_INPUT_TONS = 54        # best estimate (Plane, 2012)
ANNUAL_METEORIC_INPUT_TONS = DAILY_METEORIC_INPUT_TONS * 365  # ~20,000 tons/yr

# Composition of meteoric smoke (fraction by mass)
METEORIC_COMPOSITION = {
    'FeO': 0.35,       # iron oxide — dominant
    'MgO': 0.25,       # magnesium oxide
    'SiO2': 0.25,      # silica
    'NiO': 0.05,       # nickel oxide
    'Al2O3': 0.02,     # aluminum oxide (small natural fraction)
    'other': 0.08,
}

# Major meteor showers (approximate peak mass flux enhancement over background)
# Mass flux during shower peak relative to daily background
MAJOR_SHOWERS = {
    'Quadrantids':  {'peak_day': 3,   'duration_days': 2,  'flux_mult': 1.5,  'parent': '2003 EH1'},
    'Lyrids':       {'peak_day': 112, 'duration_days': 2,  'flux_mult': 1.2,  'parent': 'C/1861 G1 (Thatcher)'},
    'eta_Aquariids':{'peak_day': 126, 'duration_days': 5,  'flux_mult': 1.8,  'parent': '1P/Halley'},
    'Perseids':     {'peak_day': 224, 'duration_days': 4,  'flux_mult': 3.0,  'parent': '109P/Swift-Tuttle'},
    'Orionids':     {'peak_day': 294, 'duration_days': 3,  'flux_mult': 1.5,  'parent': '1P/Halley'},
    'Leonids':      {'peak_day': 320, 'duration_days': 2,  'flux_mult': 2.0,  'parent': '55P/Tempel-Tuttle'},
    'Geminids':     {'peak_day': 347, 'duration_days': 3,  'flux_mult': 4.0,  'parent': '3200 Phaethon'},
}


def annual_meteoric_metal_input(year, include_showers=True):
    """
    Calculate total meteoric metallic oxide input to mesosphere per year.

    This is the NATURAL background that adds to satellite-derived particles.
    It has existed for Earth's entire history — what's new is the additional
    Al2O3 from satellite reentry which is chemically distinct (pure alumina,
    not the silicate-dominated meteoric mix).

    Args:
        year: calendar year (Leonid storms have ~33yr periodicity)
        include_showers: whether to add major shower enhancements

    Returns:
        total_tons: total meteoric input (tons/year)
        metal_oxide_tons: metallic oxide component (tons/year)
        natural_al2o3_tons: natural Al2O3 from meteors (tons/year)
    """
    base = ANNUAL_METEORIC_INPUT_TONS

    shower_addition = 0
    if include_showers:
        for name, shower in MAJOR_SHOWERS.items():
            daily_excess = DAILY_METEORIC_INPUT_TONS * (shower['flux_mult'] - 1)
            shower_addition += daily_excess * shower['duration_days']

            # Leonid storm: ~33 year periodicity (last 1999, 2001)
            # Enhanced activity near parent comet perihelion
            if name == 'Leonids':
                years_since_storm = (year - 2001) % 33
                if years_since_storm < 3 or years_since_storm > 30:
                    shower_addition += DAILY_METEORIC_INPUT_TONS * 50  # storm outburst

    total = base + shower_addition
    metal_oxide = total * (1 - METEORIC_COMPOSITION['other'])
    natural_al2o3 = total * METEORIC_COMPOSITION['Al2O3']

    return total, metal_oxide, natural_al2o3


def meteoric_smoke_particle_density(altitude_km=80):
    """
    Estimate meteor smoke particle (MSP) number density at given altitude.

    Based on Megner et al. (2006) and Plane (2012) models.
    MSPs are ~1-10 nm in the mesosphere, growing by coagulation.

    Args:
        altitude_km: altitude in km

    Returns:
        n_msp: MSP number density (particles/cm³)
        r_mean_nm: mean particle radius (nm)
    """
    # Plane (2012) model: MSP density peaks at ~85 km
    if altitude_km > 100:
        n_msp = 1e1
        r_mean = 0.5
    elif altitude_km > 85:
        n_msp = 1e3 * np.exp(-(altitude_km - 85)**2 / 100)
        r_mean = 1.0
    elif altitude_km > 70:
        n_msp = 1e4 * np.exp(-(altitude_km - 80)**2 / 50)
        r_mean = 2.0 + (85 - altitude_km) * 0.1
    elif altitude_km > 50:
        n_msp = 1e3
        r_mean = 5.0
    else:
        n_msp = 1e2
        r_mean = 10.0

    return n_msp, r_mean


# ============================================================
# 2. CLOSE GRAVITATIONAL PASSES
# ============================================================

G = 6.674e-11      # gravitational constant (m³/kg/s²)
M_EARTH = 5.972e24  # kg
R_EARTH = 6.371e6   # meters
MOON_DISTANCE = 3.844e8  # meters (average)


def gravitational_perturbation(object_mass_kg, closest_approach_m):
    """
    Calculate gravitational perturbation from a passing body.

    For context: the Moon's tidal acceleration at Earth's surface is
    ~1.1 × 10⁻⁶ m/s². A 10 km comet (mass ~10¹³ kg) at lunar distance
    produces ~7 × 10⁻¹⁷ m/s² — about 10 BILLION times weaker than the Moon.

    Even at 10,000 km closest approach, a 10 km comet produces only
    ~7 × 10⁻⁹ m/s² — still 100× weaker than the Moon.

    Args:
        object_mass_kg: mass of passing body
        closest_approach_m: minimum distance from Earth's center

    Returns:
        tidal_accel: tidal acceleration at Earth's surface (m/s²)
        moon_fraction: ratio to lunar tidal acceleration
        magnetosphere_compression: estimated magnetopause compression (km)
    """
    # Tidal acceleration = 2 × G × M × R_earth / d³
    d = closest_approach_m
    tidal_accel = 2 * G * object_mass_kg * R_EARTH / d**3

    # Moon comparison
    moon_tidal = 2 * G * 7.342e22 * R_EARTH / MOON_DISTANCE**3  # ~1.1e-6 m/s²
    moon_fraction = tidal_accel / moon_tidal

    # Magnetospheric effect: essentially zero for small bodies
    # Magnetopause is at ~10 R_E, controlled by solar wind pressure balance
    # A passing body's gravity is negligible compared to solar wind dynamic pressure
    magnetosphere_compression = 0.0  # km, effectively zero

    return tidal_accel, moon_fraction, magnetosphere_compression


def cometary_dust_deposition(closest_approach_m, comet_production_rate_kg_s=1e3,
                              tail_length_m=1e10):
    """
    Estimate dust deposition from a comet passing near Earth.

    If a comet passes close enough, Earth may traverse its dust tail.
    The dust density in a cometary tail decreases as 1/r² from the nucleus.

    This IS a real atmospheric effect — meteor showers are exactly this,
    from ancient cometary passages. A very close pass would enhance this.

    Args:
        closest_approach_m: minimum distance
        comet_production_rate_kg_s: dust production rate (kg/s)
            Active comet: 10²-10⁴ kg/s
            Very active (Hale-Bopp class): 10⁵ kg/s
        tail_length_m: length of dust tail

    Returns:
        dust_flux_kg_m2_s: dust flux at Earth (kg/m²/s)
        daily_deposition_tons: total daily dust deposition on Earth
        enhancement_over_background: factor over normal meteoric input
    """
    # Dust density in tail: Q / (4π r² v_dust)
    # v_dust ~ 100 m/s (for larger grains) to 1000 m/s (small grains)
    v_dust = 300  # m/s, intermediate
    r = closest_approach_m

    dust_density = comet_production_rate_kg_s / (4 * np.pi * r**2 * v_dust)

    # Earth sweeps through this at relative velocity ~30 km/s (orbital speed)
    v_relative = 3e4  # m/s
    dust_flux = dust_density * v_relative  # kg/m²/s

    # Total daily deposition: flux × Earth cross section × seconds/day
    earth_cross_section = np.pi * (R_EARTH + 100e3)**2  # include atmosphere
    daily_kg = dust_flux * earth_cross_section * 86400
    daily_tons = daily_kg / 1000

    # Compare to background
    enhancement = daily_tons / DAILY_METEORIC_INPUT_TONS

    return dust_flux, daily_tons, enhancement


# ============================================================
# 3. SOLAR GEOMETRY AND HELIOSPHERIC POSITION
# ============================================================

def solar_cycle_phase(year):
    """
    Model solar activity using a sinusoidal approximation of the ~11-year cycle.

    Solar cycles affect:
      - Solar wind speed and density
      - CME frequency
      - Solar proton event frequency
      - Galactic cosmic ray modulation (anti-correlated with solar activity)

    Recent cycles: 24 (min ~2019.5), 25 (predicted max ~2025)

    Args:
        year: calendar year

    Returns:
        sunspot_number: approximate monthly smoothed sunspot number
        cme_rate_per_month: approximate CME rate
        gcr_modulation: GCR flux as fraction of solar minimum value (0-1)
    """
    # Solar cycle 25: minimum ~2019.5, maximum ~2025
    # Cycle length ~11 years
    phase = 2 * np.pi * (year - 2019.5) / 11.0

    # Sunspot number: asymmetric profile (rises faster than falls)
    # Use a modified sinusoid
    raw = np.sin(phase)
    if raw > 0:
        sunspot = 180 * raw**0.7  # solar max ~180 for cycle 25
    else:
        sunspot = 0

    # CME rate scales roughly with sunspot number
    # Solar min: ~0.5/day, solar max: ~3/day
    cme_rate = 15 + 75 * (sunspot / 180)  # per month

    # GCR modulation: anti-correlated with solar activity
    # High solar activity = low GCR (solar wind sweeps them away)
    gcr_modulation = 1.0 - 0.3 * (sunspot / 180)

    return sunspot, cme_rate, gcr_modulation


def heliospheric_current_sheet_tilt(year):
    """
    Approximate tilt angle of the heliospheric current sheet (HCS).

    The HCS separates the Sun's magnetic polarities. Its tilt varies
    with solar cycle: ~10° at solar minimum, ~70° at solar maximum.

    High tilt = Earth crosses the HCS more frequently = more
    sector boundary crossings = enhanced geomagnetic activity.

    Args:
        year: calendar year

    Returns:
        tilt_deg: HCS tilt angle in degrees
        crossings_per_rotation: approximate sector boundary crossings per solar rotation
    """
    sunspot, _, _ = solar_cycle_phase(year)
    tilt_deg = 10 + 60 * (sunspot / 180)

    # At high tilt, more crossings
    crossings = 2 + 4 * (tilt_deg / 70)  # 2 at min, 6 at max

    return tilt_deg, crossings


def orbital_distance_variation(day_of_year):
    """
    Earth-Sun distance variation due to orbital eccentricity.

    Perihelion (~Jan 3): 147.09 × 10⁶ km
    Aphelion (~Jul 4):   152.10 × 10⁶ km

    Solar wind flux varies as 1/r², so ~7% variation over the year.

    Args:
        day_of_year: day of year (1-365)

    Returns:
        distance_au: Earth-Sun distance in AU
        flux_factor: solar wind flux relative to 1 AU average
    """
    # Approximate with simple ellipse
    # Perihelion at day ~3
    e = 0.0167  # eccentricity
    theta = 2 * np.pi * (day_of_year - 3) / 365.25

    distance_au = (1 - e**2) / (1 + e * np.cos(theta))
    flux_factor = 1.0 / distance_au**2

    return distance_au, flux_factor


# ============================================================
# Integrated orbital coupling simulation
# ============================================================

def simulate_orbital_coupling(years=25, close_pass_year=None,
                               close_pass_distance_lunar=0.5,
                               close_pass_mass_kg=1e13):
    """
    Run integrated orbital coupling simulation.

    Models the combined effect of:
      - Annual meteoric dust input (background + showers)
      - Solar cycle modulation of EPP/GCR
      - Optional close cometary pass
      - Heliospheric geometry effects

    Args:
        years: simulation duration from 2025
        close_pass_year: year of hypothetical close cometary pass (None = no pass)
        close_pass_distance_lunar: closest approach in lunar distances
        close_pass_mass_kg: mass of passing body

    Returns:
        results: dict of time series
    """
    results = {
        'year': [], 'meteoric_input_tons': [], 'natural_al2o3_tons': [],
        'sunspot_number': [], 'cme_rate_month': [], 'gcr_modulation': [],
        'hcs_tilt_deg': [], 'close_pass_dust_tons_day': [],
        'combined_forcing_index': [],
    }

    for yr_idx in range(years):
        year = 2025 + yr_idx

        # Meteoric input
        total_met, metal_ox, nat_al2o3 = annual_meteoric_metal_input(year)

        # Solar cycle
        ssn, cme_rate, gcr_mod = solar_cycle_phase(year)

        # HCS tilt
        hcs_tilt, _ = heliospheric_current_sheet_tilt(year)

        # Close pass (if applicable)
        close_dust = 0.0
        if close_pass_year is not None and abs(year - close_pass_year) < 0.5:
            dist_m = close_pass_distance_lunar * MOON_DISTANCE
            _, daily_tons, _ = cometary_dust_deposition(dist_m, close_pass_mass_kg)
            close_dust = daily_tons  # peak daily rate

            tidal, moon_frac, _ = gravitational_perturbation(close_pass_mass_kg, dist_m)
            if yr_idx == 0 or (close_pass_year and year == int(close_pass_year)):
                pass  # we'll print this below

        # Combined forcing index (normalized, dimensionless)
        # Higher = more atmospheric stress
        solar_factor = ssn / 180.0  # 0-1
        gcr_factor = gcr_mod  # 0-1
        meteoric_factor = total_met / ANNUAL_METEORIC_INPUT_TONS  # ~1 normally
        close_pass_factor = 1 + close_dust / DAILY_METEORIC_INPUT_TONS

        # Weight solar activity highest (it drives EPP and CMEs)
        combined = (0.4 * solar_factor +
                    0.2 * gcr_factor +
                    0.2 * meteoric_factor +
                    0.2 * close_pass_factor)

        results['year'].append(year)
        results['meteoric_input_tons'].append(total_met)
        results['natural_al2o3_tons'].append(nat_al2o3)
        results['sunspot_number'].append(ssn)
        results['cme_rate_month'].append(cme_rate)
        results['gcr_modulation'].append(gcr_mod)
        results['hcs_tilt_deg'].append(hcs_tilt)
        results['close_pass_dust_tons_day'].append(close_dust)
        results['combined_forcing_index'].append(combined)

    return results


# ============================================================
# Run simulation
# ============================================================
if __name__ == "__main__":
    # Context: how much do natural meteoric sources add?
    print("NATURAL METEORIC INPUT CONTEXT")
    print("=" * 60)
    total, metal, al2o3 = annual_meteoric_metal_input(2025)
    print(f"  Total meteoric input: {total:.0f} tons/year")
    print(f"  Metallic oxide fraction: {metal:.0f} tons/year")
    print(f"  Natural Al2O3 from meteors: {al2o3:.0f} tons/year")
    print(f"  Compare: satellite reentry Al2O3 ~22 tons/year (2025)")
    print(f"  Satellite/natural Al2O3 ratio: {22/al2o3:.2f}× (satellite is ~{22/al2o3*100:.0f}% of natural)")
    print(f"  BUT: satellite Al2O3 is pure alumina, meteoric is mixed silicate")
    print()

    # Gravitational perturbation context
    print("CLOSE PASS GRAVITATIONAL CONTEXT")
    print("=" * 60)
    for label, mass, dist in [
        ("10 km comet at lunar distance", 1e13, MOON_DISTANCE),
        ("10 km comet at 0.5 lunar distance", 1e13, 0.5 * MOON_DISTANCE),
        ("10 km comet at 50,000 km", 1e13, 50000e3),
        ("1 km asteroid at 50,000 km", 1e12, 50000e3),
        ("Apophis (370m) at 31,000 km (2029 flyby)", 2.7e10, 31000e3),
    ]:
        tidal, moon_frac, _ = gravitational_perturbation(mass, dist)
        print(f"  {label}:")
        print(f"    Tidal accel: {tidal:.2e} m/s²  ({moon_frac:.2e}× Moon)")
        if moon_frac < 1e-6:
            print(f"    → Gravitationally NEGLIGIBLE")
        elif moon_frac < 1e-3:
            print(f"    → Gravitationally tiny but measurable")
        else:
            print(f"    → Gravitationally significant")
        print()

    # Cometary dust deposition
    print("COMETARY DUST TAIL DEPOSITION")
    print("=" * 60)
    for label, dist, rate in [
        ("Active comet at lunar distance", MOON_DISTANCE, 1e3),
        ("Active comet at 0.5 lunar dist", 0.5 * MOON_DISTANCE, 1e3),
        ("Very active comet at 0.1 lunar dist", 0.1 * MOON_DISTANCE, 1e5),
    ]:
        flux, daily, enhancement = cometary_dust_deposition(dist, rate)
        print(f"  {label}:")
        print(f"    Daily deposition: {daily:.2f} tons/day")
        print(f"    Enhancement over background: {enhancement:.1f}×")
        print()

    # Full simulation
    print("ORBITAL COUPLING SIMULATION (with hypothetical close pass in 2035)")
    print("=" * 80)
    results = simulate_orbital_coupling(years=25, close_pass_year=2035,
                                         close_pass_distance_lunar=0.1,
                                         close_pass_mass_kg=1e13)

    print(f"{'Year':<6} | {'Meteoric (t/yr)':<16} | {'SSN':<6} | {'CME/mo':<7} | "
          f"{'GCR mod':<8} | {'Close dust':<11} | {'Forcing idx'}")
    print("-" * 80)
    for i in range(len(results['year'])):
        yr = results['year'][i]
        print(f"{yr:<6} | {results['meteoric_input_tons'][i]:<16.0f} | "
              f"{results['sunspot_number'][i]:<6.0f} | "
              f"{results['cme_rate_month'][i]:<7.0f} | "
              f"{results['gcr_modulation'][i]:<8.2f} | "
              f"{results['close_pass_dust_tons_day'][i]:<11.1f} | "
              f"{results['combined_forcing_index'][i]:<.3f}")

    print()
    print("KEY FINDINGS:")
    print("  1. Natural meteoric Al2O3 (~400 t/yr) dwarfs current satellite Al2O3 (~22 t/yr)")
    print("     BUT satellite injection is growing 15%/yr and is chemically distinct")
    print("  2. Solar cycle modulation creates ~11-year vulnerability windows")
    print("  3. Close cometary passes: gravitational effects negligible,")
    print("     but dust tail deposition could transiently multiply meteoric input")
    print("  4. Worst case: solar max + close cometary pass + weakened field (from Geomagnetic-dynamics.py)")
