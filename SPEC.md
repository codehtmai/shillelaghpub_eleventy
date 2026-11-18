# The Shillelagh website specification

The pub website serves visitors to the Essex Division clubhouse in West Orange. Visitors should be able to check the calendar, see recent pub news, plan a visit, and contact the pub about a gathering. Club volunteers can update the details and publish notices through Sveltia CMS.

## Sources and editorial decisions

- The Essex landing page introduces four affiliated destinations, including the pub and the foundation. Its spare typography and short navigation informed the homepage. [Essex Shillelaghs](https://shillelaghclub.com/)
- The foundation site covers charitable programs, membership, and Irish heritage. The Story page describes the Frank Schott Blood Drive and St. Baldrick’s fundraising and links to the foundation. [Foundation](https://essexshillelagh.com/) · [Club history](https://shillelaghpub.com/club/the-order-of-the-friendly-sons-of-the-shillelagh/)
- The pub site supplies the visitor address, phone, and separate bar and kitchen hours. Use the pub’s Friday opening time of noon. The foundation lists 3 pm on Fridays. The hall and covered deck are available by inquiry. [Visitor information](https://shillelaghpub.com/) · [Rentals](https://shillelaghpub.com/hall-rental/)
- The existing event page identifies the public Google Calendar and its New York time zone. The pub timeline identifies Facebook Page ID 431613724250812, whose embed resolves to ShillelaghPub. [Calendar](https://shillelaghpub.com/events-list/calendar/) · [Pub Facebook page](https://www.facebook.com/ShillelaghPub)

## Design and content

Use forest green, ivory, brass accents, locally bundled serif and sans-serif type, and an original shamrock mark. The homepage uses four photographs from the existing pub website, optimized for distribution. The hero shows the actual bar, with supporting images of a live performance, the clubhouse's Irish displays, and the upstairs hall. [Desktop design](docs/homepage.jpg) · [Bar](https://shillelaghpub.com/wp-content/uploads/2021/12/20190624_114802-scaled.jpg) · [Band](https://shillelaghpub.com/wp-content/uploads/2021/12/Big-Train-FSOS-scaled.jpg) · [Displays](https://shillelaghpub.com/wp-content/uploads/2021/12/20190624_115004-scaled.jpg) · [Hall](https://shillelaghpub.com/wp-content/uploads/2021/04/hall-new-years-resize2.jpg)

## Implementation and verification

Eleventy builds Home, Our Story, Events, Community, and Visit the Club at a root domain or project Pages path. Sveltia CMS manages visitor information, integration settings, homepage content, and notices. Google Calendar, Facebook, and Google Maps load directly from their providers with accompanying links. The GitHub Actions workflow tests changes and deploys main to Pages.

The automated suite checks empty and populated settings, subpath routing, and notice publication. All three tests passed after the verified values were added. The production subpath build passed. The three actual embed URLs returned HTTP 200 with the expected club calendar, pub timeline, and mapped address. The public calendar feed also returned dated events. Chromium verified homepage imagery and the mobile route to the pub phone number. CMS sign-in requires an editor with repository access.

## Launch status

GitHub reported Pages disabled for this private repository. The previous Actions run reached the Pages configuration step after passing installation and tests. The connected GitHub integration received HTTP 403 when enabling Pages. Select GitHub Actions under the repository’s Pages settings to enable the deployment, then dispatch or rerun the workflow. Check the Pages URL before transferring the existing pub domain. [Pages settings](https://github.com/codehtmai/shillelaghpub_eleventy/settings/pages) · [Deployment workflow](https://github.com/codehtmai/shillelaghpub_eleventy/actions/workflows/pages.yml)
