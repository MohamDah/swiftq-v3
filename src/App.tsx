import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import mainRoutes from "./routes/mainRoutes";

const router = createBrowserRouter(mainRoutes);

function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
