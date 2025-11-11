import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImageErrorHandling } from '../useImageErrorHandling';

describe('useImageErrorHandling', () => {
  describe('handleImageError and hasImageFailed', () => {
    it('tracks failed image IDs', () => {
      const { result } = renderHook(() => useImageErrorHandling());

      act(() => {
        result.current.handleImageError(123);
        result.current.handleImageError('image-abc');
      });

      expect(result.current.hasImageFailed(123)).toBe(true);
      expect(result.current.hasImageFailed('image-abc')).toBe(true);
      expect(result.current.hasImageFailed(456)).toBe(false);
    });

    it('handles duplicate IDs without increasing set size', () => {
      const { result } = renderHook(() => useImageErrorHandling());

      act(() => {
        result.current.handleImageError(123);
        result.current.handleImageError(123);
      });

      expect(result.current.failedImages.size).toBe(1);
    });
  });

  describe('resetFailedImages', () => {
    it('clears all failed images', () => {
      const { result } = renderHook(() => useImageErrorHandling());

      act(() => {
        result.current.handleImageError(1);
        result.current.handleImageError(2);
        result.current.resetFailedImages();
      });

      expect(result.current.failedImages.size).toBe(0);
    });
  });

  describe('resetOnDepsChange', () => {
    it('resets failed images when dependencies change', () => {
      const { result, rerender } = renderHook(
        ({ deps }) => useImageErrorHandling({ resetOnDepsChange: deps }),
        { initialProps: { deps: [1] } }
      );

      act(() => {
        result.current.handleImageError(123);
      });

      expect(result.current.failedImages.size).toBe(1);

      rerender({ deps: [2] });

      expect(result.current.failedImages.size).toBe(0);
    });

    it('simulates navigating between movies', () => {
      const { result, rerender } = renderHook(
        ({ movieId }) => useImageErrorHandling({ resetOnDepsChange: [movieId] }),
        { initialProps: { movieId: 1 } }
      );

      act(() => {
        result.current.handleImageError(123);
      });

      rerender({ movieId: 2 });

      expect(result.current.failedImages.size).toBe(0);
    });
  });
});
