import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme.js";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from "./store/index.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              transition:Bounce
            />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
