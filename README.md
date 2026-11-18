# The Shillelagh

An Eleventy website for the Friendly Sons of the Shillelagh, with Sveltia CMS and a GitHub Pages deployment workflow. The design, sources, and delivery status are in [SPEC.md](SPEC.md).

## Run locally

Use Node.js 24. Run the commands from the repository root.

```sh
npm ci
npm test
npm run build
npm start
```

Eleventy prints the development server address. The static output is in `_site/`. To test a project Pages path, run `PATH_PREFIX=/shillelaghpub_eleventy/ npm run build`.

## Edit the site

1. Open **Club editor** in the website footer. Sign in with a GitHub account that can write to this repository. Sveltia supports signing in with a personal access token. Scope each editor's token to this repository, with Contents read and write. Enter it only in the CMS sign-in screen. Branch rules must allow the editor's publication.
2. Open **Club website → Club information and integrations** to change the homepage, story, photograph, visiting details, or external services.
3. For Google Calendar, make the club calendar public with event details visible. Under **Settings → Integrate calendar**, copy the Calendar ID. Enter that ID and the time zone in the editor.
4. Enter the public Facebook Page URL. The timeline requires a public Page that permits embedding. The community page also links directly to Facebook. Profiles and groups do not provide Page Plugin timelines.
5. Enter the complete street address including town, state and ZIP. This powers both the map and the directions link. Enter hours only when confirmed.
6. For a standalone announcement, open **Club notices**, create a notice, and publish. It appears on Community and has its own shareable page.
7. Publish saves the content to GitHub and starts the build. Future calendar events and Facebook posts update directly from their services.

## Publish with GitHub Pages

A repository administrator selects **Settings → Pages → Build and deployment → Source → GitHub Actions**. Push to main or run **Build and deploy the club website** from the Actions tab. Pull requests run the tests and build. The deployment job publishes the resulting artifact and reports the site URL. The workflow reads the Pages base path automatically.

Use the project Pages URL for acceptance testing. For the existing pub domain, the domain owner should verify the domain in GitHub, configure it in Pages, update the DNS records using GitHub's displayed instructions, and enable HTTPS once the certificate is available. Existing domain routing is independent of the code deployment.

## Media

The homepage photographs come from the existing pub website. The source images and editorial decisions are recorded in SPEC.md. Cormorant Garamond and DM Sans are bundled locally under the SIL Open Font License.
