import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { RoleProvider } from "./contexts/RoleContext";
import GlobalLoading from "./components/common/GlobalLoading";
import { GlobalErrorBoundary } from "./components/common/GlobalErrorBoundary";

export default function App() {
  return (
    <RoleProvider>
      <GlobalErrorBoundary>
        <Suspense fallback={<GlobalLoading />}>
          <RouterProvider router={router} />
        </Suspense>
      </GlobalErrorBoundary>
    </RoleProvider>
  );
}