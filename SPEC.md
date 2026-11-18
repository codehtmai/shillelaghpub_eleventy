# The Shillelagh website specification

The replacement for shillelaghpub.com should help a visitor discover the Friendly Sons of the Shillelagh, plan a visit, and follow its calendar and Facebook updates. Club volunteers should be able to update every section from a browser.

## Sources and editorial decisions

The brief identifies shillelaghpub.com as the site being replaced and names shillelaghclub.com and essexshillelagh.com as design references. The cloud proxy returned HTTP 403 for all three domains during research. Treat these as separate organizations. Use only the identity, nonprofit purpose and Irish cultural focus supplied in the brief until club details are confirmed. Never invent hours, events or contact details.

## Design

Create an editorial pub identity with forest green, warm ivory, brass accents, an original shamrock mark, serif headlines, outlined details and atmospheric photography. Use an illustrative interior until a club photograph is supplied. Provide an accessible mobile menu, visible focus states, and responsive layouts.

## Implementation and acceptance

- Eleventy produces plain HTML under both a root domain and a GitHub Pages project path.
- Provide a homepage, club story, events calendar, community updates and visit information.
- Public Google Calendar, Facebook Page Plugin and a Google Maps location use CMS-managed settings. Keep meaningful empty states while awaiting verified values. Provide direct links alongside embeds.
- Sveltia CMS edits the site and integration settings in GitHub. Browser authentication must use the editor's own credentials.
- GitHub Actions builds and tests pull requests and deploys main to Pages. The production domain changes only after owner review.
- Verify the production build, site routes, mobile navigation, CMS configuration, empty and populated integration states. Record operational handoff and remaining dependencies here.

## Implemented design and verification

[Desktop homepage design](docs/homepage.jpg). The responsive masthead, custom shamrock, green-shadowed interior photograph, cream serif title and brass italic club name introduce the site. Three image-led navigation cards lead to Events, Community and Visit. Photography is illustrative, ready for replacement with club-owned images.

The public routes are Home, Our Story, Events, Community, and Visit the Club. The admin route serves a locally bundled, version-pinned Sveltia CMS. The editable data file supplies identity, welcome text, club story, photo, address, hours, calendar ID, time zone, and Facebook page. Editors can also publish Markdown club notices with individual URLs. All public navigation uses the Pages base path.

The clean dependency install, production build, empty and populated integration builds, and project-path links were tested. Chromium verified the desktop imagery, mobile menu navigation, all five public routes at 375px, and the CMS sign-in screen. External account sign-in and club-specific live feeds require the club's information and access. The calendar ID, Page URL, and visitor address remain empty until confirmed. No DNS cutover has been performed.

## Publication status

The website and Pages workflow were pushed to the selected GitHub repository's main branch. All three automated tests passed, including publishing a club notice into the Community section. The environment proxy denied access to the GitHub Actions API and the public Pages URL, so production deployment is unverified. The owner can select GitHub Actions as the Pages source and check the workflow run. Club-specific live integration verification is pending the confirmed public calendar ID, Facebook Page URL, and street address.
