import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("test01", "routes/test01/test01.tsx"),
  route("course03", "routes/course03/index.tsx"),
  route(
    "course03/02-hello-react/01-hello-react",
    "routes/course03/c02-hello-react/01-hello-react.tsx"
  ),
  route(
    "course03/02-hello-react/02-3api-detail",
    "routes/course03/c02-hello-react/02-3api-detail.tsx"
  ),
] satisfies RouteConfig;
