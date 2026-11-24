# The Shillelagh website specification

This website serves visitors to The Shillelagh, the public pub of the Friendly Sons of the Shillelagh, Essex Division, in West Orange. Visitors should be able to check the calendar, see recent pub news, plan a visit, and contact the pub about a gathering. Volunteer editors can update the details and publish notices through Decap CMS.

## Sources and editorial decisions

- The Essex landing page introduces four affiliated destinations, including the pub and the foundation. Its spare typography and short navigation informed the homepage. [Essex Shillelaghs](https://shillelaghclub.com/)
- The foundation site covers charitable programs, membership, and Irish heritage. The About page describes the Frank Schott Blood Drive and St. Baldrick’s fundraising and links to the foundation. [Foundation](https://essexshillelagh.com/) · [Club history](https://shillelaghpub.com/club/the-order-of-the-friendly-sons-of-the-shillelagh/)
- The pub site supplies the visitor address, phone, and separate bar and kitchen hours. Use the pub’s Friday opening time of noon. The foundation lists 3 pm on Fridays. The hall and covered deck are available by inquiry. [Visitor information](https://shillelaghpub.com/) · [Rentals](https://shillelaghpub.com/hall-rental/)
- The existing event page identifies the public Google Calendar and its New York time zone. The pub timeline identifies Facebook Page ID 431613724250812, whose embed resolves to ShillelaghPub. [Calendar](https://shillelaghpub.com/events-list/calendar/) · [Pub Facebook page](https://www.facebook.com/ShillelaghPub)

The Hall Rental page preserves the original rental copy, including each space, amenities, and booking contacts. It uses the existing photograph of the upstairs hall set for a party. Volunteers can edit the copy and photograph under **Pub website → Hall Rental**. [Original rental page](https://shillelaghpub.com/hall-rental/)

## Design and content

Use “pub” for the venue in navigation, headings, accessibility labels, and the volunteer editor. Name the Friendly Sons of the Shillelagh when describing the organization and its history. Published notices and imported posts use their authors’ wording.

Use forest green, ivory, brass accents, locally bundled serif and sans-serif type, and an original shamrock mark. The homepage uses four photographs from the existing pub website, optimized for distribution. The hero shows the actual bar, with supporting images of a live performance, the clubhouse's Irish displays, and the upstairs hall. [Desktop design](docs/homepage.jpg) · [Bar](https://shillelaghpub.com/wp-content/uploads/2021/12/20190624_114802-scaled.jpg) · [Band](https://shillelaghpub.com/wp-content/uploads/2021/12/Big-Train-FSOS-scaled.jpg) · [Displays](https://shillelaghpub.com/wp-content/uploads/2021/12/20190624_115004-scaled.jpg) · [Hall](https://shillelaghpub.com/wp-content/uploads/2021/04/hall-new-years-resize2.jpg)

## Implementation and verification

The main navigation lists Home, Events, News, Menu, Hall Rental, About, and Visit the Pub in that order on desktop and mobile. Eleventy builds these pages at a root domain or project Pages path. About uses /about/. Decap CMS manages visitor information, integration settings, homepage content, and notices. Google Calendar and Google Maps load directly from their providers. The homepage and Events page use the heading “Events Calendar.” The homepage groups its calendar, News, and visitor links under “Events, news & directions.” The homepage News card reads “Read pub announcements and our latest posts.” The sole listing URL for News is /news/. The listing groups pub announcements and recent Facebook posts under separate headings. Facebook posts are rendered as dated HTML with direct permalinks. The GitHub Actions workflow tests changes and deploys main to Pages.

The automated suite checks empty and populated settings, subpath routing, and notice publication. All three tests passed after the verified values were added. The production subpath build passed. The three actual embed URLs returned HTTP 200 with the expected pub calendar, pub timeline, and mapped address. The public calendar feed also returned dated events. Chromium verified homepage imagery and the mobile route to the pub phone number. Editors sign in through DecapBridge using an invited email address.

## Launch status

The Eleventy workflow tested, built, and deployed the site to GitHub Pages. Live checks verified the homepage, Story, Events, Community, Visit, and the pub editor, plus the nine referenced assets. The live Events, Community and Visit pages contain the confirmed pub calendar, pub Facebook Page and West Orange address. [Published site](https://codehtmai.github.io/shillelaghpub_eleventy/) · [Verified workflow run](https://github.com/codehtmai/shillelaghpub_eleventy/actions/runs/44235442693/attempts/2)

At first deployment GitHub also ran its default branch-based Jekyll build, which failed. Selecting GitHub Actions as the Pages source avoids that redundant build. The existing pub domain awaits owner-approved cutover. [Pages settings](https://github.com/codehtmai/shillelaghpub_eleventy/settings/pages)


## Facebook reliability

Visitors reported a blank or error area in the Facebook iframe even though the provider returned post data to an HTTP client. Replace the iframe with server-rendered posts that work with JavaScript disabled and Facebook requests blocked. Refresh the pub’s existing published feed on deployment and every six hours. For continuity after the legacy site is retired, use a Page access token stored in GitHub Actions to read the official Graph API. Keep dated posts available if an upstream refresh fails. The confirmed pub source supplied three text posts for the initial snapshot.

Post photos are copied into the Pages artifact during refresh, including image-only posts. Visitors load them from the pub site alongside each post.

## Homepage visitor information and menu

The homepage uses the CMS pub and kitchen hours, and the shared footer links the CMS address to directions. The organization name in the footer links to the FSOS landing page, with an adjacent FSOS Foundation link. Show the current or upcoming Friday–Sunday period and the following Friday–Sunday in the calendar’s local time. The Pages workflow reads the public Google iCalendar feed every six hours and renders dated lists, including recurring and all-day events. Keep the full calendar on Events. The Menu route preserves the original /menus/ URL and transcribes the old site's June 26, 2024 menu edition into editable dishes and prices. [Published menu source](https://shillelaghpub.com/menus/)

## Pub editor sign-in

The GitHub Pages editor uses Decap CMS with the pub’s DecapBridge Git Gateway and PKCE configuration. Volunteers use invited email addresses and the identity providers offered by DecapBridge. The site administrator manages collaborator access in DecapBridge. The footer targets the registered /admin/index.html login address. Keep the public configuration and editing collections together; the repository access credential belongs in DecapBridge.

Show pub announcements in full below the homepage welcome and before weekend events and hours, newest first. The homepage and CMS toggle both default to on for new notices and for older notices without a saved visibility setting. An explicitly saved off setting takes precedence. Editors can turn off **Show on homepage** to retire an announcement from the homepage while keeping its News page. Omit the section when there are no homepage notices.

Notice images uploaded through the editor use site-root media paths in Markdown. Eleventy resolves those paths against the deployment prefix on the homepage and individual notice pages.
