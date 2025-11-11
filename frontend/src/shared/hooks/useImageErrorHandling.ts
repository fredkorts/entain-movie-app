import { useState, useCallback, useEffect } from "react";

interface UseImageErrorHandlingOptions {
  resetOnDepsChange?: unknown[];
}

export function useImageErrorHandling(options: UseImageErrorHandlingOptions = {}) {
  const [failedImages, setFailedImages] = useState<Set<number | string>>(new Set());
  const { resetOnDepsChange = [] } = options;

  // Reset failed images when dependencies change (e.g., cast changes, language switch)
  useEffect(() => {
    setFailedImages(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetOnDepsChange);

  const handleImageError = useCallback((imageId: number | string) => {
    setFailedImages(prev => new Set(prev).add(imageId));
  }, []);

  const resetFailedImages = useCallback(() => {
    setFailedImages(new Set());
  }, []);

  const hasImageFailed = useCallback((imageId: number | string) => {
    return failedImages.has(imageId);
  }, [failedImages]);

  return {
    failedImages,
    handleImageError,
    resetFailedImages,
    hasImageFailed
  };
}

export default useImageErrorHandling;