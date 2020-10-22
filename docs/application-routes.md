# Application Routes

In the context of this document we refer to application routes as the path used in the URL to reach a certain resource.

Example: https://podstation.app/#/page/Podcast/feed/aHR0cHM6Ly9mbGlwZXJhbWFkZWJvdGVjby5jb20vZmVlZC9wb2RjYXN0Lw==

## Guiding principles

* URLs should be human readable as much as possible
* sharing URLs of public resources (i.e. podcasts and episodes) should be easy

## Parameters

In order to ensure that URLs of public resources can be shared, the usage of client side ids should be avoided.

When possible, podcasts should be identified by their feedUrl, and episodes should be identified by their guid, or enclosure url, as these are usually the most unique fields of an episode inside a feed.