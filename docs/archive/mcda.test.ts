import { calculateMCDAScore, MCDAParameter } from '@/lib/mcda-parameters';

describe('MCDA Functions', () => {
  const mockParameters: MCDAParameter[] = [
    {
      id: '1',
      name: 'Distance to Towns',
      category: 'Context',
      weight: 25,
      min_value: 0,
      max_value: 10,
      description: 'Distance to nearest towns',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Infrastructure Access',
      category: 'Context',
      weight: 25,
      min_value: 0,
      max_value: 10,
      description: 'Access to infrastructure',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'Market Demand',
      category: 'Financial',
      weight: 30,
      min_value: 0,
      max_value: 10,
      description: 'Market demand analysis',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '4',
      name: 'ROI Potential',
      category: 'Financial',
      weight: 20,
      min_value: 0,
      max_value: 10,
      description: 'Return on investment potential',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
    },
  ];

  const mockEvaluations = {
    '1': 8.5,
    '2': 7.0,
    '3': 9.0,
    '4': 6.5,
  };

  describe('calculateMCDAScore', () => {
    it('calculates correct weighted score', () => {
      const score = calculateMCDAScore(mockEvaluations);
      
      // Expected calculation:
      // (8.5 * 0.25) + (7.0 * 0.25) + (9.0 * 0.30) + (6.5 * 0.20)
      // = 2.125 + 1.75 + 2.7 + 1.3 = 7.875
      expect(score).toBeCloseTo(7.875, 2);
    });

    it('returns 0 for empty evaluations', () => {
      const score = calculateMCDAScore({});
      expect(score).toBe(0);
    });

    it('handles partial evaluations', () => {
      const partialEvaluations = {
        '1': 8.0,
        '3': 9.0,
      };
      
      const score = calculateMCDAScore(partialEvaluations);
      
      // Should only calculate for available evaluations
      // (8.0 * 0.25) + (9.0 * 0.30) = 2.0 + 2.7 = 4.7
      expect(score).toBeCloseTo(4.7, 2);
    });

    it('handles edge case values', () => {
      const edgeEvaluations = {
        '1': 0,
        '2': 10,
        '3': 5,
        '4': 2.5,
      };
      
      const score = calculateMCDAScore(edgeEvaluations);
      
      // (0 * 0.25) + (10 * 0.25) + (5 * 0.30) + (2.5 * 0.20)
      // = 0 + 2.5 + 1.5 + 0.5 = 4.5
      expect(score).toBeCloseTo(4.5, 2);
    });

    it('validates score is within expected range', () => {
      const maxEvaluations = {
        '1': 10,
        '2': 10,
        '3': 10,
        '4': 10,
      };
      
      const maxScore = calculateMCDAScore(maxEvaluations);
      expect(maxScore).toBeLessThanOrEqual(10);
      expect(maxScore).toBeGreaterThanOrEqual(0);
      
      const minEvaluations = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
      };
      
      const minScore = calculateMCDAScore(minEvaluations);
      expect(minScore).toBe(0);
    });
  });

  describe('MCDA Parameter Validation', () => {
    it('validates parameter structure', () => {
      const parameter = mockParameters[0];
      
      expect(parameter).toHaveProperty('id');
      expect(parameter).toHaveProperty('name');
      expect(parameter).toHaveProperty('category');
      expect(parameter).toHaveProperty('weight');
      expect(parameter).toHaveProperty('min_value');
      expect(parameter).toHaveProperty('max_value');
      expect(parameter).toHaveProperty('is_active');
    });

    it('validates weight is percentage', () => {
      mockParameters.forEach(param => {
        expect(param.weight).toBeGreaterThanOrEqual(0);
        expect(param.weight).toBeLessThanOrEqual(100);
      });
    });

    it('validates min/max value ranges', () => {
      mockParameters.forEach(param => {
        expect(param.min_value).toBeLessThanOrEqual(param.max_value);
        expect(param.min_value).toBeGreaterThanOrEqual(0);
        expect(param.max_value).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('Category Weight Distribution', () => {
    it('validates total weights sum to 100%', () => {
      const totalWeight = mockParameters.reduce((sum, param) => sum + param.weight, 0);
      expect(totalWeight).toBe(100);
    });

    it('groups parameters by category correctly', () => {
      const categories = mockParameters.reduce((acc, param) => {
        if (!acc[param.category]) {
          acc[param.category] = [];
        }
        acc[param.category].push(param);
        return acc;
      }, {} as Record<string, typeof mockParameters>);

      expect(categories).toHaveProperty('Context');
      expect(categories).toHaveProperty('Financial');
      expect(categories.Context).toHaveLength(2);
      expect(categories.Financial).toHaveLength(2);
    });
  });
});

