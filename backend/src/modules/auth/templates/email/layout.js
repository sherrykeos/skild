import { app } from "../../config/app.config.js";

function emailLayout({
  title,
  heading,
  content,
  buttonText,
  buttonUrl,
  footerText,
}) {
  return `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 40px 20px;
        background-color: #0b0b0b;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
          'Segoe UI Symbol';
        color: #e5e7eb;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #161616;
        border: 1px solid #2a2a2a;
        border-radius: 16px;
        padding: 40px;
      }
      h1 { margin: 0 0 20px; font-size: 28px; font-weight: 700; text-align: center; color: #ffffff; }
      h2 { margin: 30px 0 15px; font-size: 24px; font-weight: 600; color: #ffffff; }
      p { font-size: 16px; line-height: 1.8; margin: 0 0 1.5em; color: #9ca3af; }
      .button-wrapper { text-align: center; padding: 20px 0; }
      .button { display: inline-block; padding: 14px 32px; background-color: #6ae1ff; color: #000000; text-decoration: none; font-weight: 600; border-radius: 50px; }
      .footer-text { font-size: 14px; line-height: 1.6; color: #71717a; }
      .copyright { margin-top: 30px; padding-top: 20px; border-top: 1px solid #2a2a2a; font-size: 13px; color: #71717a; text-align: center; }
    </style>
  </head>

  <body>
    <div class="container">
      <h1>${app.name}</h1>

      <h2>${heading}</h2>

      <p>
        ${content}
      </p>

      <div class="button-wrapper">
        <a href="${buttonUrl}" class="button">
          ${buttonText}
        </a>
      </div>

      <p class="footer-text">
        ${footerText}
      </p>

      <div class="copyright">
        Â© ${new Date().getFullYear()} ${app.name}
      </div>
    </div>
  </body>
</html>

`;
}

export default emailLayout;
