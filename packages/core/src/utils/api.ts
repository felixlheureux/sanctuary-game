export const getApiUrl = (mode: string) => {
  const hostname = window.location.hostname;

  switch (mode) {
    case "production":
      return `https://api.${hostname.substring(hostname.indexOf(".") + 1)}`;
    case "staging":
      return `https://api-dev.${hostname.substring(hostname.indexOf(".") + 1)}`;
    default:
      return "http://localhost:8080";
  }
};

const STRIPE_TEST_PUBLISHABLE_KEY = "pk_test_51IB0JjBFLFuEKur7WuOqbL4ngsdzdOr4A2Y3hlYgBAYErhJGH1buYedJGKjDdACvPokYWs87r62yKgOQ2KmzdkKn00B2c2Rthk";

export const STRIPE_PUBLISHABLE_KEY = (() => {
  // gitlab sets this env var see partner.gitlab-ci.yaml
  const env = process.env["REACT_APP_HELLODARWIN_STRIPE_PUBLISHABLE_KEY"];

  if (env !== undefined) {
    return env;
  }

  return STRIPE_TEST_PUBLISHABLE_KEY;
})();


