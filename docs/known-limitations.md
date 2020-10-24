# Known Limitations

## Unable to show images or play audio from some podcasts

Some browsers stopped allowing the usage of mixed content (http resources in https pages) - see chromium's blog post [No More Mixed Messages About HTTPS](https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html).

As we are dealing with 3rd party content, we use what is distributed in the feed.

Native apps can easily deal with 3rd party http resources, but Progressive Web Apps can't.

We should try to inform the users and tell them to contact the podcast owner asking them to support https, as it is a security issue.