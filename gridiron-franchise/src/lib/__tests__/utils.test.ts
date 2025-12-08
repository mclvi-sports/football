import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'active', false && 'hidden')).toBe('base active');
  });

  it('handles undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('handles object syntax', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('merges conflicting Tailwind classes', () => {
    // Later class should win
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles responsive prefixes', () => {
    expect(cn('md:px-2', 'md:px-4')).toBe('md:px-4');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
  });

  it('handles complex Tailwind compositions', () => {
    const result = cn(
      'base-class',
      'px-4 py-2',
      { 'bg-blue-500': true, 'bg-red-500': false },
      ['rounded', 'shadow']
    );
    expect(result).toContain('base-class');
    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
    expect(result).toContain('bg-blue-500');
    expect(result).not.toContain('bg-red-500');
    expect(result).toContain('rounded');
    expect(result).toContain('shadow');
  });
});
