# The Shillelagh

An Eleventy website for The Shillelagh, the public pub of the Friendly Sons of the Shillelagh in West Orange, with Decap CMS and DecapBridge and a GitHub Pages deployment workflow. The design, sources, and delivery status are in [SPEC.md](SPEC.md).

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

1. Accept your DecapBridge invitation, then open **Pub editor** in the footer. Click the login button and sign in using the invited email address with Google, Microsoft, or the method offered by DecapBridge.
2. Open **Pub website → Pub information and integrations** to change the homepage, story, photograph, visiting details, or external services.
3. For Google Calendar, make the pub calendar public with event details visible. Under **Settings → Integrate calendar**, copy the Calendar ID. Enter that ID and the time zone in the editor.
4. Enter the public Facebook Page URL. The News page links directly to this Page. Dated posts are synchronized for the configured ShillelaghPub feed.
5. Enter the complete street address including town, state and ZIP. This powers both the map and the directions link. Enter hours only when confirmed.
6. For a standalone announcement, open **Pub announcements**, create a notice, and publish. It appears on News and has its own shareable page.
7. Publish saves the content to GitHub and starts the build. Calendar events update directly from Google Calendar. GitHub Actions refreshes Facebook posts on deployment and on a six-hour schedule.

### Manage editor access

In the pub’s DecapBridge dashboard, open the site and use **Manage collaborators** to invite or remove editors. The registered CMS login URL is `https://codehtmai.github.io/shillelaghpub_eleventy/admin/index.html`. The public PKCE and gateway endpoints are in `src/admin/config.yml`. Manage the repository credential in DecapBridge. When changing the public domain, update the CMS login URL in DecapBridge and the public site URL in the CMS configuration together.

## Publish with GitHub Pages

A repository administrator selects **Settings → Pages → Build and deployment → Source → GitHub Actions**. Push to main or run **Build and deploy the pub website** from the Actions tab. Pull requests run the tests and build. The deployment job publishes the resulting artifact and reports the site URL. The workflow reads the Pages base path automatically.

Use the project Pages URL for acceptance testing. For the existing pub domain, the domain owner should verify the domain in GitHub, configure it in Pages, update the DNS records using GitHub's displayed instructions, and enable HTTPS once the certificate is available. Existing domain routing is independent of the code deployment.

## Media

The homepage photographs come from the existing pub website. The source images and editorial decisions are recorded in SPEC.md. Cormorant Garamond and DM Sans are bundled locally under the SIL Open Font License.

## Facebook feed

Visitors read posts in the page HTML. No Facebook login, cookies, or embedded widget is needed to read the excerpts. Each has a publication date and a link to the original post.

The default importer reads the public updates already published by the existing pub WordPress site. Before retiring that site, a Facebook Page administrator should provide a Meta Page access token for the pub Page (ID 431613724250812) with permission to read its posts (`pages_read_engagement`). A repository administrator stores it under **Settings → Secrets and variables → Actions** as a repository secret named `FACEBOOK_PAGE_ACCESS_TOKEN`, then runs the Pages workflow. The importer switches to the Graph API when the secret is present. Review the refresh step for success. Renew the token if Meta revokes or expires it.

The importer publishes post text, dates, permalinks, and local copies of post photos. If a refresh fails, the workflow warns and reuses the previously published feed or the repository snapshot. Local builds use the snapshot. If the pub switches Facebook Pages, update the importer's Page ID and URL along with the public CMS setting.

The homepage and Visit page share the pub and kitchen hours in the pub settings. Edit the food menu under **Pub website → Pub menu** and update its edition date when changing prices. The homepage weekend preview uses the public iCalendar feed; the deployment refreshes it with the six-hour schedule. To refresh the local snapshot, run `node scripts/refresh-weekends.mjs`.
