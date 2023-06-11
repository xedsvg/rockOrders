export const baseUrl =
  window.location.hostname === "localhost"
    ? "http://localhost/api"
    : `https://${window.location.hostname}/api`;

export const version = "0.0.1";
