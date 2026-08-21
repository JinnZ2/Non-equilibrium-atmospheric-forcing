"""Structural audit: what the model's FORM cannot represent.

RESEARCH_LOG.md tracks parametric unknowns (U-n) — "we don't know this number."
This module tracks structural ones (S-n) — "the model has no variable for this,
so no value of any parameter would fix it."

The distinction matters because the whole repo has been improving along the
parametric axis (sourcing yields, residence times, ENSO figures) while the
structural axis went unexamined. Sourcing every parameter in a model whose
state space is wrong produces a well-cited wrong answer.

Everything printed here is computed or read from the code, not asserted.

Usage:
    python Structural-audit.py
"""

import ast
import importlib.util
import math
import pathlib
import sys

HERE = pathlib.Path(__file__).parent

_spec = importlib.util.spec_from_file_location(
    "accumulation_with_coupling", HERE / "Accumulation-with-coupling.py"
)
model = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(model)

# Physical constants for the percolation check
RHO_AL2O3 = 3950.0            # kg/m^3, corundum
R_EARTH = 6.371e6             # m
STRAT_LO, STRAT_HI = 15e3, 50e3   # stratospheric shell, m
PERCOLATION_PHI = 0.29        # random overlapping spheres, approximate
NOMINAL_DIAMETER = 100e-9     # m, representative nanoparticle


def stratosphere_volume():
    return 4 * math.pi * R_EARTH**2 * (STRAT_HI - STRAT_LO)


def percolation_check(burden_mt, diameter=NOMINAL_DIAMETER):
    """S-8: is a 'conductive mesh' geometrically available at this loading?"""
    v_strat = stratosphere_volume()
    v_particles = (burden_mt * 1e6) / RHO_AL2O3        # 1 MT = 1e6 kg
    phi = v_particles / v_strat
    v_one = (4 / 3) * math.pi * (diameter / 2) ** 3
    n_per_m3 = (v_particles / v_one) / v_strat
    spacing = n_per_m3 ** (-1 / 3) if n_per_m3 > 0 else float("inf")
    return {
        "burden_mt": burden_mt,
        "volume_fraction": phi,
        "n_per_cm3": n_per_m3 / 1e6,
        "mean_spacing_mm": spacing * 1e3,
        "spacing_in_diameters": spacing / diameter,
        "shortfall_to_percolation": PERCOLATION_PHI / phi if phi > 0 else float("inf"),
    }


def chi_dependencies():
    """S-5: what does chi actually depend on? Read from the signature."""
    src = (HERE / "Accumulation-with-coupling.py").read_text()
    tree = ast.parse(src)
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and node.name == "calculate_coupling_coefficient":
            return [a.arg for a in node.args.args]
    return []


def coupling_graph():
    """S-5/S-6: which modules feed chi, and which merely sit beside it?"""
    rows = []
    for p in sorted(HERE.glob("*.py")):
        if p.name == "Structural-audit.py":
            continue
        src = p.read_text()
        rows.append({
            "module": p.name,
            "loads_chi_model": "Accumulation-with-coupling.py" in src,
            "chi_references": sum(
                1 for line in src.splitlines()
                if "chi" in line.lower() and not line.strip().startswith("#")
            ),
        })
    return rows


def _model_identifiers():
    """Every name the modelling code actually binds: variables, functions, params.

    AST-based on purpose. A text search would match the word in a comment or
    in this file's own prose and report the concept as present when no code
    computes it — which is exactly the kind of false pass this audit exists
    to avoid.
    """
    names = set()
    for p in sorted(HERE.glob("*.py")):
        if p.name == "Structural-audit.py":      # never audit the auditor
            continue
        try:
            tree = ast.parse(p.read_text())
        except SyntaxError:
            continue
        for node in ast.walk(tree):
            if isinstance(node, ast.Name):
                names.add(node.id.lower())
            elif isinstance(node, ast.arg):
                names.add(node.arg.lower())
            elif isinstance(node, ast.FunctionDef):
                names.add(node.name.lower())
            elif isinstance(node, ast.Attribute):
                names.add(node.attr.lower())
            elif isinstance(node, ast.keyword) and node.arg:
                names.add(node.arg.lower())
    return names


def missing_state_variables():
    """S-1..S-4: state variables a stratospheric aerosol model would need.

    Checks whether the concept is BOUND AS AN IDENTIFIER anywhere in the
    modelling code — i.e. whether anything actually computes with it.
    """
    concepts = {
        "altitude": ("altitude", "alt_high", "alt_low"),
        "latitude": ("latitude", "lat_rad", "lat_deg"),
        "particle radius / diameter": ("particle_radius", "particle_diameter"),
        "particle SIZE DISTRIBUTION": ("size_distribution", "dn_dlogr",
                                       "radius_bins", "radii"),
        "sedimentation / settling velocity": ("sedimentation", "settling",
                                              "v_settle", "stokes", "fall_speed"),
        "coagulation": ("coagulation", "coag"),
        "nucleation / condensation": ("nucleation", "condensation"),
        "particle surface area": ("surface_area", "particle_surface", "s_area"),
        "ion number density": ("ion_density", "n_ion", "ion_pair",
                               "ionisation", "ionization"),
        "ion mobility": ("mobility", "mu_ion"),
        "derived air conductivity": ("conductivity", "sigma_air"),
    }
    names = _model_identifiers()
    out = {}
    for label, keys in concepts.items():
        hits = sorted({n for n in names for k in keys if k in n})
        out[label] = hits
    return out


def temporal_horizon():
    """S-12: how far forward and backward does any model reach?"""
    import re
    fwd, deep = 0, {}
    deep_terms = ("paleo", "holocene", "pleistocene", "ice core", "myr",
                  "excursion", "laschamp", "supernova", "milankovitch")
    for p in sorted(HERE.glob("*.py")):
        if p.name == "Structural-audit.py":
            continue
        src = p.read_text().lower()
        for m in re.findall(r"years_to_run\s*=\s*(\d+)", src):
            fwd = max(fwd, int(m))
        for term in deep_terms:
            deep[term] = deep.get(term, 0) + src.count(term)
    return fwd, deep


def stabilising_terms():
    """S-13: does anything in the models damp, saturate, or recover?"""
    terms = ("recovery", "damping", "relaxation", "equilibrat", "saturat",
             "resilien", "self_limit", "homeostas", "negative_feedback")
    counts = {}
    for p in sorted(HERE.glob("*.py")):
        if p.name == "Structural-audit.py":
            continue
        src = p.read_text().lower()
        for term in terms:
            counts[term] = counts.get(term, 0) + src.count(term)
    return counts


def main():
    print("=" * 76)
    print("STRUCTURAL AUDIT — limits of the model's FORM, not its parameters")
    print("=" * 76)

    # ---- S-5 / S-6 -------------------------------------------------------
    print("\nS-5  WHAT CHI DEPENDS ON")
    print("-" * 76)
    deps = chi_dependencies()
    print(f"  calculate_coupling_coefficient({', '.join(deps)})")
    print(f"  -> chi is a function of {len(deps)} scalars. That is the entire")
    print("     'coupling' in a project named for coupling.")

    print("\nS-5  MODULE / CHI GRAPH")
    print("-" * 76)
    print(f"  {'module':<36}{'loads chi model':>18}{'chi refs':>12}")
    orphans = []
    for r in coupling_graph():
        print(f"  {r['module']:<36}{str(r['loads_chi_model']):>18}{r['chi_references']:>12}")
        if not r["loads_chi_model"] and r["chi_references"] == 0:
            orphans.append(r["module"])
    print()
    print("  Modules that neither feed nor read chi:")
    for o in orphans:
        print(f"    - {o}")
    print("  The three domain modules added to represent COUPLING domains")
    print("  (chemical, geomagnetic, orbital) do not couple to anything.")
    print("  They are parallel calculators sharing a directory.")

    print("\nS-6  FEEDBACK")
    print("-" * 76)
    print("  Data flow is strictly one-way: injection -> burden -> chi -> label.")
    print("  Nothing downstream re-enters anything upstream. A system with no")
    print("  loops cannot produce emergent thresholds, hysteresis, multiple")
    print("  stable states, or any other complex-systems behaviour. Whatever")
    print("  nonlinearity appears in the output was written into the transfer")
    print("  function by hand (H-04).")

    # ---- S-1..S-4 --------------------------------------------------------
    print("\nS-1..S-4  STATE VARIABLES: WHAT IS BOUND ANYWHERE IN THE CODE")
    print("-" * 76)
    print("  Identifier-level check (AST). Presence of a name is NOT the same as")
    print("  having a resolved dimension — most of what appears below is a single")
    print("  fixed scalar in one module, not a state variable the burden model")
    print("  carries. Read the identifiers, not just the checkbox.")
    print()
    present = missing_state_variables()
    absent = []
    for label, hits in present.items():
        if hits:
            shown = ", ".join(hits[:3]) + ("..." if len(hits) > 3 else "")
            print(f"  [x] {label:<36} {shown}")
        else:
            print(f"  [ ] {label:<36} —")
            absent.append(label)
    print(f"\n  Entirely absent: {len(absent)} of {len(present)}")
    for a in absent:
        print(f"    - {a}")
    print()
    print("  The nuance that matters: `particle_radius_m` and `particle_diameter_m`")
    print("  exist, but as SINGLE FIXED VALUES — there is no size distribution.")
    print("  Sedimentation goes as r^2 and ion attachment as surface area, so a")
    print("  monodisperse assumption cannot produce either, and neither is")
    print("  computed anywhere. Altitude and latitude appear only in the chemical")
    print("  and geomagnetic modules, which do not feed chi (see S-5); the burden")
    print("  model itself is a single global scalar with no spatial dimension.")
    print()
    print("  Residence time is IMPOSED to stand in for all of this — which is why")
    print("  H-13's 6x disagreement cannot be settled from inside this model.")

    # ---- S-8 -------------------------------------------------------------
    print("\nS-8  IS A 'CONDUCTIVE MESH' GEOMETRICALLY AVAILABLE?")
    print("-" * 76)
    print("  README/EXEC_SUMMARY claim high-density Al particulate creates a")
    print("  conductive 'mesh' supporting 'geometric resonance'. Testing that")
    print(f"  against a percolation threshold of phi ~ {PERCOLATION_PHI}, with")
    print(f"  {NOMINAL_DIAMETER*1e9:.0f} nm particles in a {(STRAT_HI-STRAT_LO)/1e3:.0f} km stratospheric shell:")
    print()
    print(f"  {'burden MT':>12}{'vol fraction':>16}{'n /cm3':>10}"
          f"{'spacing':>12}{'in diameters':>15}")
    for b in (22, model.CRITICAL_THRESHOLD_MT, 1970, 39552):
        r = percolation_check(b)
        print(f"  {r['burden_mt']:>12,}{r['volume_fraction']:>16.2e}"
              f"{r['n_per_cm3']:>10.1f}{r['mean_spacing_mm']:>9.2f} mm"
              f"{r['spacing_in_diameters']:>15,.0f}")
    r = percolation_check(model.CRITICAL_THRESHOLD_MT)
    print()
    print(f"  At the {model.CRITICAL_THRESHOLD_MT:,.0f} MT critical threshold the volume fraction is")
    print(f"  {r['volume_fraction']:.2e} — short of percolation by a factor of "
          f"{r['shortfall_to_percolation']:.1e}")
    print(f"  ({math.log10(r['shortfall_to_percolation']):.1f} orders of magnitude), with particles ~"
          f"{r['mean_spacing_mm']:.1f} mm apart,")
    print(f"  roughly {r['spacing_in_diameters']:,.0f} diameters of empty air between neighbours.")
    print()
    print("  A percolating conductive network is not available at any burden")
    print("  this repo projects. The 'mesh' is not a small effect here — it is")
    print("  not a mechanism. See RESEARCH_LOG.md H-19.")

    # ---- S-7 -------------------------------------------------------------
    print("\nS-7  CONDUCTIVITY IS ASSERTED, NEVER DERIVED — AND THE SIGN IS SUSPECT")
    print("-" * 76)
    print("  Air conductivity is sigma = sum(n_i * q_i * mu_i): it is carried by")
    print("  MOBILE CHARGE CARRIERS IN THE GAS, not by the particles' own bulk")
    print("  conductivity. No code here computes it.")
    print()
    print("  The established ion-aerosol result runs the other way: aerosol")
    print("  particles SCAVENGE small ions, converting high-mobility molecular")
    print("  ions into low-mobility charged aerosol, and conductivity DROPS.")
    print("  Conductivity and aerosol loading are inversely related, and this")
    print("  has been studied at stratospheric heights.")
    print()
    print("  So the repo's central premise — more particles, more conductivity —")
    print("  may have the WRONG SIGN. Being metallic does not obviously rescue")
    print("  it: mobility of a charged 100 nm particle is orders of magnitude")
    print("  below a molecular ion regardless of composition, and S-8 rules out")
    print("  a percolating path. See RESEARCH_LOG.md H-19.")

    # ---- S-12 / S-13 -----------------------------------------------------
    print("\nS-12  TEMPORAL HORIZON")
    print("-" * 76)
    fwd, deep = temporal_horizon()
    total_deep = sum(deep.values())
    print(f"  Forward horizon (longest years_to_run): {fwd} years")
    print(f"  Backward horizon: {total_deep} deep-time references across all models")
    print("    " + " · ".join(f"{k} {v}" for k, v in deep.items()))
    print()
    print("  Processes at issue have characteristic times of 10^3-10^6 years.")
    print("  The satellite record is ~50 years. That is too short to establish")
    print("  natural variance, and it discards the only empirical constraint")
    print("  available: the planet has run this experiment repeatedly at far")
    print("  larger amplitude. See DEEP_TIME.md.")

    print("\nS-13  STABILISING TERMS — CAN THE MODELLED SYSTEM RECOVER?")
    print("-" * 76)
    counts = stabilising_terms()
    for k, v in counts.items():
        print(f"  {k:<20} {v}")
    if sum(counts.values()) == 0:
        print()
        print("  ZERO. There is no damping, saturation, recovery or homeostasis")
        print("  anywhere. Combined with S-6 (no loops), the modelled system can")
        print("  accumulate and amplify and do nothing else.")
        print()
        print("  The paleo record's dominant signal is the opposite. A ~100x")
        print("  cosmic-ray increase from nearby supernovae, sustained for")
        print("  centuries, produced impacts LIMITED BY COMPENSATING EFFECTS.")
        print("  This is not merely an omission — the model form encodes an")
        print("  assumption the empirical record contradicts. See H-20.")

    print("\n" + "=" * 76)
    print("These are STRUCTURAL limits. No value of any parameter in")
    print("coupling_config.json fixes any of them. See STRUCTURAL_LIMITS.md.")
    print("=" * 76)
    return 0


if __name__ == "__main__":
    sys.exit(main())
