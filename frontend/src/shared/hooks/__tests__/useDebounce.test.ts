import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  describe('Core functionality', () => {
    it('returns initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial'));
      expect(result.current).toBe('initial');
    });

    it('updates value after default delay', async () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });
      expect(result.current).toBe('initial');

      await waitFor(() => {
        expect(result.current).toBe('updated');
      }, { timeout: 1000 });
    });

    it('updates value after custom delay', async () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 100 } }
      );

      rerender({ value: 'updated', delay: 100 });

      await waitFor(() => {
        expect(result.current).toBe('updated');
      }, { timeout: 300 });
    });
  });

  describe('Cancellation behavior', () => {
    it('cancels previous timer on rapid changes', async () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 200),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'change1' });
      await new Promise(resolve => setTimeout(resolve, 50));
      rerender({ value: 'change2' });
      await new Promise(resolve => setTimeout(resolve, 50));
      rerender({ value: 'change3' });

      expect(result.current).toBe('initial');

      await waitFor(() => {
        expect(result.current).toBe('change3');
      }, { timeout: 500 });
    });

    it('cleans up timer on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
      const { unmount } = renderHook(() => useDebounce('test'));
      unmount();
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  describe('Different data types', () => {
    it('handles string, number, and object values', async () => {
      const { result: strResult, rerender: strRerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: 'initial' } }
      );
      strRerender({ value: 'updated' });
      await waitFor(() => expect(strResult.current).toBe('updated'), { timeout: 300 });

      const { result: numResult, rerender: numRerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: 1 } }
      );
      numRerender({ value: 42 });
      await waitFor(() => expect(numResult.current).toBe(42), { timeout: 300 });

      const obj = { id: 1 };
      const { result: objResult, rerender: objRerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: obj } }
      );
      const newObj = { id: 2 };
      objRerender({ value: newObj });
      await waitFor(() => expect(objResult.current).toEqual(newObj), { timeout: 300 });
    });
  });
});
