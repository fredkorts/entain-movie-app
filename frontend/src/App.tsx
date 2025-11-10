import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ThemeContext, useThemeInit } from "./theme/ThemeContext";

export default function App() {
  const themeCtx = useThemeInit();
  const algorithm = themeCtx.mode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  return (
    <ThemeContext.Provider value={themeCtx}>
      <ConfigProvider theme={{ algorithm }}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
