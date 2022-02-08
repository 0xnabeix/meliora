import Create from "../pages/create";
import Create2 from "../pages/create2";
import Projects from "../pages/projects";
import Project from "../pages/project";
import TokenContract from "../pages/tokencontract";
import TokenContract2 from "../pages/tokencontract2";

export const routes = [
  { path: "/create", Component: Create },
  { path: "/create2", Component: Create2 },
  { path: "/projects", Component: Projects },
  { path: "/token-contract", Component: TokenContract },
  { path: "/project/:id", Component: Project },
  { path: "/token-contract2", Component: TokenContract2 },
];
