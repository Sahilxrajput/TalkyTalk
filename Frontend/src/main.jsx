import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import ErrorBoundary  from "./utils/ErrorBoundary.jsx"
import { ToastContainer, Bounce } from 'react-toastify';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserContext>
        {/* <ErrorBoundary> */}
        <App />
        <ToastContainer
position="top-right"
autoClose={3000}
hideProgressBar={false}
newestOnTop
closeOnClick
rtl={false}
pauseOnFocusLoss
theme="light"
transition={Bounce}
/>
        {/* </ErrorBoundary> */}
      </UserContext>
    </BrowserRouter>
  </StrictMode>
);
