export default {
  port: 1337,
  dbUri: "mongodb://localhost:27017/songbook",
  saltWorkFactor: 10,
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  public_key: `-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PjeyQO8Av/elpvcFKuy
  lhos+D+yhHiqGCC842e2r0PEAEuW8kA8VawNp7/7j7lGqT26driZdbvFrumuKIz2
  bTtnwEN5Q9G9HT9vNelZAwfqALsUqFmK/NNGCC4vTkvEL3ZzMMBWfoWqtQoNpNw6
  O9v3IhpYxufMwNv5scCtBdmsUV1B66rGBkDbUPQSSs9exsI0DHDUtdoCej9eC6QA
  z5jZBYkOFum6QPYJl7jZVJKuI8lSQZhDPYad+dDpWdiCMHFrVhmHOTnqxw26Ox43
  rQC4X9Ri6iLxup0ijVVOrFSywEEbeRB35AocLo5V8PlPsGAjvpTFA4aPsAFjClya
  pQIDAQAB
  -----END PUBLIC KEY-----`,
};
