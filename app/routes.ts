import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  route("", "routes/guest-layout.tsx", [
    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),
  ]),

  route("", "routes/dashboard-layout.tsx", [
    route("/payment/success", "routes/payment-success.tsx"),
    ...prefix("dashboard", [
      index("routes/dashboard.tsx"),
      route("analytics", "routes/analytics.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
