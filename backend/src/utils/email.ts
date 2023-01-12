export const emailHtml = (link: string) => `
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Songbook</title>
      <style>
        body {
          height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          position: relative;
        }
        p {
          font-size: 14px;
        }
        .card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 42rem;
          width: 32rem;
          padding: 1rem;
        }
        .main {
          text-transform: uppercase;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid black;
          color: #fff !important;
          background-color: rgb(40, 40, 40);
          cursor: pointer;
          width: 100%;
          display: block;
          text-align: center;
          text-decoration: none;
        }
        .spacing {
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Reset Password</h1>
        <p>
          You recently asked to change your Songbook password. Click the button or
          link below to get started.
        </p>
        <a href="${link}" target="_blank" class="main">Password Reset</a>
        <div class="spacing"><a href="${link}" target="_blank">${link}</a></div>
      </div>
    </body>
  </html>
`;
