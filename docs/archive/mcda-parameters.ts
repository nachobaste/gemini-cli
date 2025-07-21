// Updated MCDA parameters based on MCDAParameters.xlsx
export const mcdaCategories = [
  {
    id: 'context',
    name: 'Context',
    weight: 25, // 25% of total score
    parameters: [
      {
        id: 'distance_towns',
        name: 'Distance to Nearest Town(s)/Villages',
        description: 'Distance to population centers and their size',
        weight: 25, // 25% within Context category
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Closer distance to larger towns (more potential users) = higher score'
      },
      {
        id: 'neighborhood_control',
        name: 'Neighborhood Control',
        description: 'Public vs. Private Ownership, Zoning Restrictions',
        weight: 25,
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Private ownership with flexible zoning = higher score'
      },
      {
        id: 'topography',
        name: 'Topography',
        description: 'Terrain and Natural Features',
        weight: 25,
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Flat land with minimal environmental restrictions = higher score'
      },
      {
        id: 'infrastructure_connections',
        name: 'Infrastructure Connections',
        description: 'Access to Roads, Utilities',
        weight: 25,
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Direct access to paved roads, utilities = higher score'
      }
    ]
  },
  {
    id: 'property',
    name: 'Property',
    weight: 25, // 25% of total score
    parameters: [
      {
        id: 'land_capacity',
        name: 'Land Capacity (Size)',
        description: 'Total Area of the Property',
        weight: 50, // 50% within Property category
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Larger land size offers more development options = higher score (consider diminishing returns for excessively large areas)'
      },
      {
        id: 'site_analysis',
        name: 'Site Analysis',
        description: 'Existing Structures, Vegetation, Historical Significance',
        weight: 50,
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Existing structures that can be repurposed = positive factor. Valuable vegetation or historical landmarks might require preservation, impacting development options (consider score deduction)'
      }
    ]
  },
  {
    id: 'market',
    name: 'Market',
    weight: 25, // 25% of total score
    parameters: [
      {
        id: 'population_composition',
        name: 'Population Composition & Growth',
        description: 'Age, Income Level, Growth Trends',
        weight: 25, // 25% within Market category
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Younger population with higher disposable income and positive growth trends = higher score'
      },
      {
        id: 'purchasing_power',
        name: 'Purchasing Power',
        description: 'Ability of Local Population to Afford Development',
        weight: 25,
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Strong purchasing power in the target demographic = higher score'
      },
      {
        id: 'existing_market_offerings',
        name: 'Existing Market Offerings',
        description: 'Products & Prices of Similar Developments',
        weight: 25,
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Lack of similar developments in the area creates higher demand = positive factor. Existing, successful developments with similar offerings might indicate market saturation (consider score deduction)'
      },
      {
        id: 'absorption_rates',
        name: 'Absorption Rates',
        description: 'Speed at Which Similar Developments Sell',
        weight: 25,
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Faster absorption rates for similar developments indicate strong market demand = higher score'
      }
    ]
  },
  {
    id: 'profitability',
    name: 'Profitability',
    weight: 25, // 25% of total score
    parameters: [
      {
        id: 'revaluation_potential',
        name: 'Revaluation Potential',
        description: 'Projected Increase in Land Value After Development',
        weight: 34, // 34% within Profitability category
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Development plan with high potential for increased land value = higher score'
      },
      {
        id: 'capital_requirement',
        name: 'Capital Requirement',
        description: 'Investment Needed for Development',
        weight: 33,
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Lower upfront investment costs = higher score'
      },
      {
        id: 'inventory_consumption_time',
        name: 'Inventory Consumption Time',
        description: 'Estimated Time to Sell Developed Units',
        weight: 33,
        minValue: 0,
        maxValue: 10,
        evaluationCriteria: 'Faster sales velocity for developed units = higher score'
      }
    ]
  }
];

// Function to calculate MCDA score
export function calculateMCDAScore(parameterValues: Record<string, number>): number {
  let totalScore = 0;

  mcdaCategories.forEach(category => {
    let categoryScore = 0;
    let totalCategoryWeight = 0;

    category.parameters.forEach(parameter => {
      const value = parameterValues[parameter.id] || 0;
      const normalizedValue = Math.max(0, Math.min(10, value)); // Ensure value is between 0-10
      const weightedValue = (normalizedValue * parameter.weight) / 100;
      categoryScore += weightedValue;
      totalCategoryWeight += parameter.weight;
    });

    // Normalize category score and apply category weight
    const normalizedCategoryScore = totalCategoryWeight > 0 ? (categoryScore / totalCategoryWeight) * 100 : 0;
    totalScore += (normalizedCategoryScore * category.weight) / 100;
  });

  return Math.round(totalScore * 100) / 100; // Round to 2 decimal places
}

// Function to get parameter by ID
export function getParameterById(parameterId: string) {
  for (const category of mcdaCategories) {
    const parameter = category.parameters.find(p => p.id === parameterId);
    if (parameter) {
      return { ...parameter, categoryId: category.id, categoryName: category.name };
    }
  }
  return null;
}

// Function to validate category weights (should sum to 100%)
export function validateCategoryWeights(): boolean {
  const totalWeight = mcdaCategories.reduce((sum, category) => sum + category.weight, 0);
  return Math.abs(totalWeight - 100) < 0.01; // Allow for small floating point errors
}

// Function to validate parameter weights within each category
export function validateParameterWeights(): Record<string, boolean> {
  const results: Record<string, boolean> = {};
  
  mcdaCategories.forEach(category => {
    const totalWeight = category.parameters.reduce((sum, param) => sum + param.weight, 0);
    results[category.id] = Math.abs(totalWeight - 100) < 0.01;
  });
  
  return results;
}

