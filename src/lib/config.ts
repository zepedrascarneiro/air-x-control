export const PLAN_CONFIG = {
  basePlanPrice: 397,
  baseAircraftIncluded: 2,
  aircraftAddonPrice: 97,
};

export function calculateMonthlyFee(aircraftCount: number) {
  if (aircraftCount <= PLAN_CONFIG.baseAircraftIncluded) {
    return PLAN_CONFIG.basePlanPrice;
  }

  const additionalAircraft = aircraftCount - PLAN_CONFIG.baseAircraftIncluded;
  return PLAN_CONFIG.basePlanPrice + additionalAircraft * PLAN_CONFIG.aircraftAddonPrice;
}

export function getAdditionalAircraftCount(aircraftCount: number) {
  return Math.max(0, aircraftCount - PLAN_CONFIG.baseAircraftIncluded);
}
