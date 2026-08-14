import numpy as np
import matplotlib.pyplot as plt

def simulate_aluminum_accumulation(years_to_run=20, launch_growth_rate=0.15):
    """
    Simulates the accumulation of Al2O3 nanoparticles in the upper atmosphere.
    Accounts for residence time and exponential growth of LEO constellations.
    """
    # Constants based on 2024/25 research
    KG_PER_METRIC_TON = 1000
    AL_PER_SATELLITE = 30  # kg of Al2O3 nanoparticles per 250kg satellite
    RESIDENCE_TIME = 30    # years particles stay in the stratosphere/mesosphere
    
    # Starting conditions (2024 baseline)
    current_annual_satellites_reentering = 500 # Estimated annual burn-rate
    
    # Data storage
    time_series = np.arange(2024, 2024 + years_to_run)
    annual_injection = []
    total_atmospheric_burden = []
    
    # Buffer to track particles "in flight" (decaying over 30 years)
    # Using a simple linear decay model for atmospheric fallout
    active_particles = np.zeros(RESIDENCE_TIME) 

    for year in range(years_to_run):
        # 1. Calculate this year's injection
        sats_this_year = current_annual_satellites_reentering * ((1 + launch_growth_rate) ** year)
        new_al_mass = (sats_this_year * AL_PER_SATELLITE) / KG_PER_METRIC_TON
        
        # 2. Add to our "active" atmospheric buffer
        # New particles start at index 0
        active_particles[0] += new_al_mass
        
        # 3. Calculate total burden currently in the sky
        current_burden = np.sum(active_particles)
        
        annual_injection.append(new_al_mass)
        total_atmospheric_burden.append(current_burden)
        
        # 4. Age the particles (Move them toward the "fallout" limit)
        # Shift the array: particles at index 29 fall out this year
        active_particles = np.roll(active_particles, 1)
        active_particles[0] = 0 
        
    return time_series, annual_injection, total_atmospheric_burden

# Run Simulation
years, injection, burden = simulate_aluminum_accumulation(years_to_run=25, launch_growth_rate=0.20)

# Output for your GitHub findings
print(f"2040 Forecasted Annual Al2O3 Injection: {injection[16]:.2f} Metric Tons")
print(f"2040 Forecasted Total Atmospheric Burden: {burden[16]:.2f} Metric Tons")
