from typing import List
from app.models import Fish
from app.schemas import CompatibilityIssue, CompatibilityResponse, FishResponse

def check_fish_compatibility(fishes: List[Fish]) -> CompatibilityResponse:
    if not fishes:
        return CompatibilityResponse(
            is_compatible=True,
            status="Empty Tank",
            score=100,
            recommendation="Add at least 2 fish species to simulate biological cohabitation.",
            temp_range="—",
            ph_range="—",
            min_tank_liters=0,
            issues=[],
            fishes=[]
        )

    if len(fishes) == 1:
        fish = fishes[0]
        return CompatibilityResponse(
            is_compatible=True,
            status="Single Species Setup",
            score=100,
            recommendation=f"{fish.name} thrives comfortably on its own in tanks starting from {fish.min_tank_liters} L.",
            temp_range=f"{fish.temp_min}°C – {fish.temp_max}°C",
            ph_range=f"{fish.ph_min} – {fish.ph_max}",
            min_tank_liters=fish.min_tank_liters,
            issues=[],
            fishes=[FishResponse.model_validate(fish)]
        )

    issues: List[CompatibilityIssue] = []
    score = 100

    # 1. Check water types (Marine vs Freshwater)
    water_types = set(f.water_type for f in fishes)
    if len(water_types) > 1:
        score -= 60
        marine_fish = [f.name for f in fishes if f.water_type == "Marine"]
        fresh_fish = [f.name for f in fishes if f.water_type == "Freshwater"]
        issues.append(CompatibilityIssue(
            type="danger",
            title="Critical Habitat Salinity Conflict!",
            message=f"Cannot mix marine species ({', '.join(marine_fish)}) with freshwater species ({', '.join(fresh_fish)}). They require fundamentally incompatible salinity levels!"
        ))

    # 2. Temperature overlapping check
    highest_temp_min = max(f.temp_min for f in fishes)
    lowest_temp_max = min(f.temp_max for f in fishes)

    if highest_temp_min > lowest_temp_max:
        score -= 25
        cold_fish = [f.name for f in fishes if f.temp_max < highest_temp_min]
        warm_fish = [f.name for f in fishes if f.temp_min > lowest_temp_max]
        issues.append(CompatibilityIssue(
            type="danger",
            title="Incompatible Temperature Range",
            message=f"Warm water species ({', '.join(warm_fish)}) need T > {highest_temp_min}°C, whereas coldwater species ({', '.join(cold_fish)}) cannot tolerate temperatures exceeding {lowest_temp_max}°C."
        ))
        temp_str = "No Common Range"
    else:
        temp_str = f"{highest_temp_min:.1f}°C – {lowest_temp_max:.1f}°C"

    # 3. pH overlapping check
    highest_ph_min = max(f.ph_min for f in fishes)
    lowest_ph_max = min(f.ph_max for f in fishes)

    if highest_ph_min > lowest_ph_max:
        score -= 20
        issues.append(CompatibilityIssue(
            type="warning",
            title="pH Chemistry Mismatch",
            message=f"No overlapping pH range exists between selected species (individual ranges span {min(f.ph_min for f in fishes)}–{max(f.ph_max for f in fishes)})."
        ))
        ph_str = "No Common pH"
    else:
        ph_str = f"{highest_ph_min:.1f} – {lowest_ph_max:.1f}"

    # 4. Temperament & Predation check
    predators = [f for f in fishes if "Carnivore" in f.diet or "Predator" in f.temperament]
    peaceful = [f for f in fishes if "Peaceful" in f.temperament or "Schooling" in f.temperament]

    bettas = [f for f in fishes if "Betta" in f.name or "Betta" in (f.scientific_name or "")]
    if len(bettas) > 1:
        score -= 40
        issues.append(CompatibilityIssue(
            type="danger",
            title="Lethal Territorial Aggression",
            message="Multiple male Bettas in the same tank will fight territorial battles. House them in separate aquariums."
        ))

    # 5. Tank size calculation
    base_tank = max(f.min_tank_liters for f in fishes)
    extra_liters = (len(fishes) - 1) * 20
    calc_tank = base_tank + extra_liters

    if any(f.min_tank_liters >= 250 for f in fishes):
        issues.append(CompatibilityIssue(
            type="info",
            title="Spacious Showcase Aquarium Recommended",
            message="Large species detected in this selection. Heavy biological filtration and tank length of at least 120 cm is advised."
        ))

    score = max(5, min(100, score))

    if score >= 85:
        status = "Ideal Compatibility"
        recommendation = "Outstanding pairing! These species share matching water chemistry, peaceful social dynamics, and will thrive harmoniously."
        is_comp = True
    elif score >= 50:
        status = "Compatible with Caution"
        recommendation = "Cohabitation is viable for experienced aquarists with ample hiding rockwork, plants, and close water monitoring."
        is_comp = True
    else:
        status = "Biologically Incompatible!"
        recommendation = "Housing these species together will lead to severe stress, disease, or predation. Separate habitats are strongly advised."
        is_comp = False

    return CompatibilityResponse(
        is_compatible=is_comp,
        status=status,
        score=score,
        recommendation=recommendation,
        temp_range=temp_str,
        ph_range=ph_str,
        min_tank_liters=calc_tank,
        issues=issues,
        fishes=[FishResponse.model_validate(f) for f in fishes]
    )
