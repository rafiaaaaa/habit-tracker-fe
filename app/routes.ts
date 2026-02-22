import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/payment/success", "routes/payment-success.tsx"),

  ...prefix("dashboard", [index("routes/dashboard.tsx")]),
] satisfies RouteConfig;
