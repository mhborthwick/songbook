export default {
  origin: "http://localhost:3000",
  domain: "localhost",
  port: 1337,
  dbUri: "mongodb://mongodb:27017/songbook",
  saltWorkFactor: 10,
  accessTokenTtl: "30m",
  refreshTokenTtl: "1y",
  public_key: `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAxU8iMHkIYcIHWvKw6ywO
72oPqVo4rWmT6McxFzxMTHSeqJRqn4UKvZWY6+n5v3MShKjmNh2IMRpv7woHsSbO
YZLH9Ga053y4vjQ+2H2J03c0JdXIFOeJTPkbwDITY8jIoOD4hThyV5GoYRJpfumg
eGdWrq07q7Ays+cl1FA/b2GpiGd9mHWbY7gBWTDN933VoTG0z6p4Av2tsODcro6I
hBjeag1uq6IjZzFUwlNR4OSA8CgrWRj3su+hWCFDvFvtnW5fPolg3s0ULv7zZi85
hxNF5PYZvvUBANOTjskYHgL5p9eqI93q+SUdxschtM+9Fwgjlhp6cJFC79b3BraR
6mqq1B6KhPqlU0UxO4iyvZD+ppKb1VWbg/0yBqCXL1uMe/BkO7p00xNj+XBVEA7Y
dVH3vrNLbtd5lCO9zfG9M8WX6Lhu607n17uax2QH1eE4fX61Htgnp5LksEg+/ngl
2dbzI3ndLdkPQM0kL3LeXOkWvhJy2/D1YUi9LAOMv4WDbTH6SmtjpS7O8xqCp2v+
fZEyD2hQq3TfBFJbXj2/ttzgD3mtDEt+PtWX4tdu83I0u7E51GhNfnYxfDX0desy
j0AQyBS/ngQkCYbU2YbRy7mRQ1QVqsGvKZY3uEB7w/mZkZuTFac0ujCyZ9DfV2Nx
/fPSUFm4t22pD1TDRX2i8JsCAwEAAQ==
-----END PUBLIC KEY-----`,
};
