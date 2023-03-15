module.exports = {
  ruleArchive: "latest",
  policies: [ "IBM_Accessibility" ],
  failLevels: [
    "violation",
    "potentialviolation",
    "recommendation",
    "potentialrecommendation"
  ],
  reportLevels: [
    "violation",
    "potentialviolation",
    "recommendation",
    "potentialrecommendation",
    "manual",
    "pass",
  ],
  outputFormat: [ "json" ],
  label: [ "JUST-CHECKING-IDK" ],
  outputFolder: "IBM",
  baselineFolder: "test/baselines",
  cacheFolder: "/tmp/accessibility-checker"
};