import { createBrowserRouter } from "react-router-dom";
import urls from "../urls";
import Home from "../../pages/home/Home";

const router = createBrowserRouter([
    {
      path: urls.home,
      element: <Home />,
    },
  ]);

export default router;