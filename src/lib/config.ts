export const PLAN_CONFIG = {
  // Plano Essencial (GRATUITO)
  entryPlanPrice: 0,
  entryAircraftIncluded: 1,
  
  // Plano Profissional
  basePlanPrice: 397,
  baseAircraftIncluded: 2,
  
  // Plano Enterprise
  enterprisePlanPrice: 697,
  enterpriseAircraftIncluded: 5,
  
  // Add-on
  aircraftAddonPrice: 97,
};

export type PlanType = "entry" | "professional";

export function calculateMonthlyFee(aircraftCount: number, planType: PlanType = "professional") {
  if (planType === "entry") {
    if (aircraftCount <= PLAN_CONFIG.entryAircraftIncluded) {
      return PLAN_CONFIG.entryPlanPrice;
    }
    const additionalAircraft = aircraftCount - PLAN_CONFIG.entryAircraftIncluded;
    return PLAN_CONFIG.entryPlanPrice + additionalAircraft * PLAN_CONFIG.aircraftAddonPrice;
  }
  
  // Plano Profissional
  if (aircraftCount <= PLAN_CONFIG.baseAircraftIncluded) {
    return PLAN_CONFIG.basePlanPrice;
  }

  const additionalAircraft = aircraftCount - PLAN_CONFIG.baseAircraftIncluded;
  return PLAN_CONFIG.basePlanPrice + additionalAircraft * PLAN_CONFIG.aircraftAddonPrice;
}

export function getAdditionalAircraftCount(aircraftCount: number, planType: PlanType = "professional") {
  const included = planType === "entry" ? PLAN_CONFIG.entryAircraftIncluded : PLAN_CONFIG.baseAircraftIncluded;
  return Math.max(0, aircraftCount - included);
}
