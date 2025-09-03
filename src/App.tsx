import "./global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./app/queryClient";
import AppRouter from "./app/router";
import ToastMount from "./components/ui/ToastMount";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <ToastMount />
    </QueryClientProvider>
  );
}
