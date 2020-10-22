# Local Persistency

## What data do we (want to) persist locally?

As a client side podcast aggregator, we will have to store, for instance the following data locally, for offline usage:
- general configuration
- player state (i.e. which media is playing, what is the current play time, etc...)
- list of subscribed podcasts
- list of episodes from the subscribed podcasts
- podcast specific configuration (i.e. play speed of a certain podcast, should download new episodes automatically?)
- episode specific information (i.e. is it downloaded? is it in progress? is it bookmarked, favorited?)

## Podcast data vs user data



## References

- [Using the Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API) - mainly about localStorage and sessionStorage.
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - contains a list of libraries for storage at the end.
- https://web.dev/storage-for-the-web/