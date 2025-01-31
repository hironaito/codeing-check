import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { z } from 'zod';
import axios from 'axios';
import { SampleChart } from '@/components/ui/SampleChart';

// Zodの動作確認
describe('Zod', () => {
  it('should validate data', () => {
    const Schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const validData = { name: 'Test', age: 20 };
    const result = Schema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

// Axiosの動作確認
describe('Axios', () => {
  it('should create instance', () => {
    const instance = axios.create({
      baseURL: 'https://api.example.com',
    });
    expect(instance).toBeDefined();
  });
});

// React Testing Libraryの動作確認
describe('SampleChart', () => {
  it('should render without crashing', () => {
    const { container } = render(<SampleChart />);
    expect(container).toBeDefined();
  });
}); 