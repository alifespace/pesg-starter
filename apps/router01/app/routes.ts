import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("test01", "routes/test01.tsx"),
] satisfies RouteConfig;
