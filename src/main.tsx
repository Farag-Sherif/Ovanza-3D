import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const BackgroundCanvas = lazy(() => import("./components/three/BackgroundCanvas"));
const ThreeGuard = lazy(() => import("./components/three/ThreeGuard"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <Suspense fallback={null}>
            <ThreeGuard>
              <BackgroundCanvas />
            </ThreeGuard>
          </Suspense>
          <App />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#1a1511",
                color: "#f2ead9",
                border: "1px solid rgba(212,169,92,0.3)",
                borderRadius: "14px",
              },
            }}
          />
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  </StrictMode>
);
