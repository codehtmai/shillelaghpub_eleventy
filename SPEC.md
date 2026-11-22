# The Shillelagh website specification

The pub website serves visitors to the Essex Division clubhouse in West Orange. Visitors should be able to check the calendar, see recent pub news, plan a visit, and contact the pub about a gathering. Club volunteers can update the details and publish notices through Decap CMS.

## Sources and editorial decisions

- The Essex landing page introduces four affiliated destinations, including the pub and the foundation. Its spare typography and short navigation informed the homepage. [Essex Shillelaghs](https://shillelaghclub.com/)
- The foundation site covers charitable programs, membership, and Irish heritage. The Story page describes the Frank Schott Blood Drive and St. Baldrick’s fundraising and links to the foundation. [Foundation](https://essexshillelagh.com/) · [Club history](https://shillelaghpub.com/club/the-order-of-the-friendly-sons-of-the-shillelagh/)
- The pub site supplies the visitor address, phone, and separate bar and kitchen hours. Use the pub’s Friday opening time of noon. The foundation lists 3 pm on Fridays. The hall and covered deck are available by inquiry. [Visitor information](https://shillelaghpub.com/) · [Rentals](https://shillelaghpub.com/hall-rental/)
- The existing event page identifies the public Google Calendar and its New York time zone. The pub timeline identifies Facebook Page ID 431613724250812, whose embed resolves to ShillelaghPub. [Calendar](https://shillelaghpub.com/events-list/calendar/) · [Pub Facebook page](https://www.facebook.com/ShillelaghPub)

## Design and content

Use forest green, ivory, brass accents, locally bundled serif and sans-serif type, and an original shamrock mark. The homepage uses four photographs from the existing pub website, optimized for distribution. The hero shows the actual bar, with supporting images of a live performance, the clubhouse's Irish displays, and the upstairs hall. [Desktop design](docs/homepage.jpg) · [Bar](https://shillelaghpub.com/wp-content/uploads/2021/12/20190624_114802-scaled.jpg) · [Band](https://shillelaghpub.com/wp-content/uploads/2021/12/Big-Train-FSOS-scaled.jpg) · [Displays](https://shillelaghpub.com/wp-content/uploads/2021/12/20190624_115004-scaled.jpg) · [Hall](https://shillelaghpub.com/wp-content/uploads/2021/04/hall-new-years-resize2.jpg)

## Implementation and verification

Eleventy builds Home, Our Story, Events, Community, and Visit the Club at a root domain or project Pages path. Decap CMS manages visitor information, integration settings, homepage content, and notices. Google Calendar and Google Maps load directly from their providers. Facebook posts are rendered as dated HTML with direct permalinks. The GitHub Actions workflow tests changes and deploys main to Pages.

The automated suite checks empty and populated settings, subpath routing, and notice publication. All three tests passed after the verified values were added. The production subpath build passed. The three actual embed URLs returned HTTP 200 with the expected club calendar, pub timeline, and mapped address. The public calendar feed also returned dated events. Chromium verified homepage imagery and the mobile route to the pub phone number. CMS sign-in requires an editor with repository access.

## Launch status

The Eleventy workflow tested, built, and deployed the site to GitHub Pages. Live checks verified the homepage, Story, Events, Community, Visit, and the club editor, plus the nine referenced assets. The live Events, Community and Visit pages contain the confirmed club calendar, pub Facebook Page and West Orange address. [Published site](https://codehtmai.github.io/shillelaghpub_eleventy/) · [Verified workflow run](https://github.com/codehtmai/shillelaghpub_eleventy/actions/runs/44235442693/attempts/2)

At first deployment GitHub also ran its default branch-based Jekyll build, which failed. Selecting GitHub Actions as the Pages source avoids that redundant build. The existing pub domain awaits owner-approved cutover. [Pages settings](https://github.com/codehtmai/shillelaghpub_eleventy/settings/pages)


## Facebook reliability

Visitors reported a blank or error area in the Facebook iframe even though the provider returned post data to an HTTP client. Replace the iframe with server-rendered posts that work with JavaScript disabled and Facebook requests blocked. Refresh the club’s existing published feed on deployment and every six hours. For continuity after the legacy site is retired, use a Page access token stored in GitHub Actions to read the official Graph API. Keep dated posts available if an upstream refresh fails. The confirmed pub source supplied three text posts for the initial snapshot.

Post photos are copied into the Pages artifact during refresh, including image-only posts. Visitors load them from the club site alongside each post.

## Homepage visitor information and menu

The homepage uses the CMS pub and kitchen hours, and the shared footer links the CMS address to directions. Show the current or upcoming Friday–Sunday period and the following Friday–Sunday in the calendar’s local time. The Pages workflow reads the public Google iCalendar feed every six hours and renders dated lists, including recurring and all-day events. Keep the full calendar on Events. The Menu route preserves the original /menus/ URL and transcribes the old site's June 26, 2024 menu edition into editable dishes and prices. [Published menu source](https://shillelaghpub.com/menus/)

## Club editor sign-in

The GitHub Pages editor uses Decap CMS with the club’s DecapBridge Git Gateway and PKCE configuration. Volunteers use invited email addresses and the identity providers offered by DecapBridge. The club owner manages collaborator access in DecapBridge. The footer targets the registered /admin/index.html login address. Keep the public configuration and editing collections together; the repository access credential belongs in DecapBridge.

Notice images uploaded through the editor use site-root media paths in Markdown. Eleventy resolves those paths against the deployment prefix when rendering notice pages.
