import numpy as np

def calculate_coupling_coefficient(burden_mt, solar_activity_index=1.0):
    """
    Calculates the 'Blind Spot' risk: EM Coupling.
    burden_mt: Total metric tons of Al2O3 in the stratosphere.
    solar_activity_index: 1.0 (baseline) to 5.0 (Extreme solar max).
    """
    # Threshold: Estimated mass at which conductivity changes become significant.
    # Note: This value is speculative; no observational constraint exists yet.
    # With corrected ~5yr residence time, reaching this takes longer than
    # previously projected with 30yr residence time.
    critical_threshold = 1000
    
    # Nonlinear scaling: Risk increases quadratically once threshold is crossed
    if burden_mt < critical_threshold:
        coupling_factor = (burden_mt / critical_threshold) ** 2
    else:
        # Cascade regime: Exponential growth of coupling
        coupling_factor = 1 + np.log10(burden_mt / critical_threshold + 1) * 2
        
    # The actual 'Coupling Coefficient' (Risk of induced currents/Ozone destruction)
    chi = coupling_factor * solar_activity_index
    return chi

# Integration into your simulation
years_to_run = 20
burden = 0
# Residence time: ~5 years based on meteor smoke particle transport literature
# (Plane, 2012; Megner et al., 2008). Previous value of 30 was unsupported.
RESIDENCE_TIME = 5
active_particles = np.zeros(RESIDENCE_TIME)

print(f"{'Year':<6} | {'Al Burden (MT)':<15} | {'Coupling Coeff (χ)':<20} | {'Risk Level'}")
print("-" * 60)

for year in range(years_to_run):
    current_year = 2025 + year
    
    # New injection logic
    annual_injection = (730 * (1.15**year) * 30) / 1000
    active_particles[0] += annual_injection
    burden = np.sum(active_particles)
    
    # Calculate Coupling
    chi = calculate_coupling_coefficient(burden, solar_activity_index=1.2) # Solar Cycle 25/26
    
    # Define Risk Level
    if chi < 0.5: status = "Nominal"
    elif chi < 1.5: status = "Incipient Coupling"
    elif chi < 3.0: status = "Systemic Fragility"
    elif chi < 5.0: status = "Pre-Cascade"
    else: status = "CASCADE FAILURE"
    
    print(f"{current_year:<6} | {burden:<15.2f} | {chi:<20.2f} | {status}")
    
    active_particles[1:] = active_particles[:-1]  # Shift right, oldest falls off
    active_particles[0] = 0  # Clear slot for next year's injection
