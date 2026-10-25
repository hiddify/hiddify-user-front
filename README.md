## Improve Translations
You can easily contribute to this project by using the following links to improve the translations:
- [English](https://inlang.com/editor/github.com/hiddify/hiddify-user-front?lang=en)
- [Persian](https://inlang.com/editor/github.com/hiddify/hiddify-user-front?lang=en&lang=fa)
- [Russian](https://inlang.com/editor/github.com/hiddify/hiddify-user-front?lang=en&lang=ru)
- [Chinese](https://inlang.com/editor/github.com/hiddify/hiddify-user-front?lang=en&lang=zh)

<h1>first clone the project</h1>

<h4>You have to install node js in order to run the project</h4>

<h5>nodejs download link:</h5> 

https://nodejs.org/en/download/current

after installing node you must download and install yarn

<h5>install yarn:</h5> npm install --global yarn

<h5>insert this command to install the packages:</h5>

yarn

<h5>insert this command to run the server:</h5>

yarn dev

<h5>insert this command to make a build file:</h5>

yarn build

## Custom user page

A panel admin can show users their own build of this page instead of the built-in one:
**Settings › Customizing User Page › User page URL**.

1. Fork this repository and change what you like.
2. Every push to `main` builds the page into the `gh-pages` branch (`.github/workflows/main.yml`).
   To build by hand: `USER_FRONT_OUT_DIR=dist npx vite build`, then publish `dist/` anywhere.
3. In the panel, set the user page URL to the folder that holds `index.html`, for example:
   - `https://github.com/<you>/hiddify-user-front/tree/gh-pages` (read from raw.githubusercontent.com; GitHub Pages
     doesn't have to be on), or
   - `https://<you>.github.io/hiddify-user-front/`, or any other static host.

The panel downloads the files itself (the server is abroad, so a host that is filtered for users still works), caches
them for an hour and serves them on the user's own link. Users never connect to GitHub.

### What the panel gives the page

| Where | What |
| --- | --- |
| `/<proxy_path>/<uuid>/` | the site's `index.html` |
| `/<proxy_path>/<uuid>/user-page/<file>` | the site's other files; `<base href>` points here, so keep every path in the build **relative** (Vite `base: './'`) |
| `window.__HIDDIFY__` | the object below, set first in `<head>` |

```js
window.__HIDDIFY__ = {
  version: "14.0.5",                         // panel version
  proxy_path: "AbCdEf",                      // the client proxy path (PROXY PATH)
  uuid: "…",                                 // the user's UUID
  page_base: "/AbCdEf/<uuid>/",              // the user's page
  api_base: "/AbCdEf/<uuid>/api/v2/user/",   // the user API: me/, mtproxies/, all-configs/, apps/, short/ …
  static_base: "/AbCdEf/static/",            // the panel's static files (images, fonts)
  profile_url: "https://…/<uuid>/#name",     // the subscription link for apps
  deep_link: "hiddify://import/https://…",   // opens it in the Hiddify app
  lang: "fa",                                // the user's language
  brand_title: "…",                          // Settings › Branding title
}
```

The only things a page **must** use are `api_base` (or `proxy_path` + `uuid`) and relative asset paths; the rest is
for convenience. The user API is described in the panel at `/<proxy_path>/<uuid>/api/v2/user/docs` (OpenAPI).
Without `window.__HIDDIFY__` (the panel's built-in page, `npm run dev`) this app falls back to its own URL.
