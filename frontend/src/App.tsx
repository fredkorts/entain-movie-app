import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ConfigProvider, theme as antdTheme } from "antd";
import type { ThemeConfig } from "antd";
import { ThemeContext, useThemeInit } from "./theme/ThemeContext";
import { useMemo, useState, useEffect } from "react";

export default function App() {
  const themeCtx = useThemeInit();
  const algorithm = themeCtx.mode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;
  const [refreshKey, setRefreshKey] = useState(0);

  // Force re-computation of tokens after theme changes
  useEffect(() => {
    // Small delay to ensure DOM has updated with new data-theme attribute
    const timer = setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 0);
    return () => clearTimeout(timer);
  }, [themeCtx.mode]);

  // Resolve CSS variables to concrete color values for Ant Design tokens
  const tokens = useMemo((): ThemeConfig["token"] | undefined => {
    if (typeof window === "undefined") return undefined;

    const styles = getComputedStyle(document.documentElement);
    const val = (name: string) => styles.getPropertyValue(name).trim();

    return {
      // Layout & Containers
      colorBgLayout: val("--color-bg-primary") || undefined,
      colorBgContainer: val("--color-bg-secondary") || undefined,
      colorBgElevated: val("--color-bg-elevated") || undefined,
      colorBgMask: val("--color-bg-mask") || undefined,
      
      // Text
      colorText: val("--color-text-primary") || undefined,
      colorTextHeading: val("--color-text-primary") || undefined,
      colorTextSecondary: val("--color-text-secondary") || undefined,
      colorTextTertiary: val("--color-text-tertiary") || undefined,
      colorTextDisabled: val("--color-text-disabled") || undefined,
      
      // Borders
      colorBorder: val("--color-border-primary") || undefined,
      colorBorderSecondary: val("--color-border-secondary") || undefined,
      
      // Brand
      colorPrimary: val("--color-primary") || undefined,
      colorPrimaryHover: val("--color-primary-hover") || undefined,
      colorPrimaryActive: val("--color-primary-active") || undefined,
      colorPrimaryBg: val("--color-primary-bg") || undefined,
      colorPrimaryBorder: val("--color-primary-border") || undefined,
      
      // Semantic Colors
      colorSuccess: val("--color-success") || undefined,
      colorSuccessBg: val("--color-success-bg") || undefined,
      colorSuccessBorder: val("--color-success-border") || undefined,
      
      colorWarning: val("--color-warning") || undefined,
      colorWarningBg: val("--color-warning-bg") || undefined,
      colorWarningBorder: val("--color-warning-border") || undefined,
      
      colorError: val("--color-error") || undefined,
      colorErrorBg: val("--color-error-bg") || undefined,
      colorErrorBorder: val("--color-error-border") || undefined,
      
      colorInfo: val("--color-info") || undefined,
      colorInfoBg: val("--color-info-bg") || undefined,
      colorInfoBorder: val("--color-info-border") || undefined,
      
      // Links
      colorLink: val("--color-link") || undefined,
      colorLinkHover: val("--color-link-hover") || undefined,
      colorLinkActive: val("--color-link-active") || undefined,
      
      // Shape
      borderRadius: 8,
    };
    // We DO want to recompute when theme changes or refreshKey updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeCtx.mode, refreshKey]);

  return (
    <ThemeContext.Provider value={themeCtx}>
      <ConfigProvider theme={{ algorithm, token: tokens }}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
