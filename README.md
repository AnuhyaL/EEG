# Environmental Education Group website

A static website (plain HTML, CSS and JavaScript, no build step). Open `index.html` in a browser, or upload the whole folder to any web host.

## Pages

| File | Section |
|---|---|
| `index.html` | Home |
| `about.html` | About EEG |
| `programs.html` | Programs & Initiatives |
| `resources.html` | Research & Resources (searchable library) |
| `media.html` | Media & Stories |
| `people.html` | People & Community |
| `get-involved.html` | Get Involved & Donate |
| `contact.html` | Contact (includes the privacy policy at `#privacy`) |

Shared files: `assets/css/style.css`, `assets/js/main.js`, and images in `assets/img/`.

## Forms

The contact form and newsletter sign-ups have no server behind them. By default they open the visitor's email app with a message addressed to Lielle@environmentaleducationgroup.org.

To collect submissions online instead, create a form endpoint (for example with Formspree) and paste its URL into `FORM_ENDPOINT` at the top of `assets/js/main.js`.

## Editing

The header and footer are repeated in each page. If you change a menu item or the footer, update all eight HTML files.
