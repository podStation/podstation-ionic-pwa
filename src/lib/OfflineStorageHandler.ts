export type Podcast = {
	feedUrl: string,
	title?: string,
	description?: string,
	imageUrl?: string,
	subscribed: boolean
}

export default interface OfflineStorageHandler {
	storePodcast(podcast: Podcast): Promise<void>;
	getPodcasts(): Promise<Array<Podcast>>;
}

export class OfflineStorageHandlerImplementation implements OfflineStorageHandler {
	async storePodcast(podcast: Podcast): Promise<void> {
		let storedPodcasts = localStorage['podcasts'];

		storedPodcasts = storedPodcasts ? JSON.parse(storedPodcasts) : [];

		// ensure we are not storing more data than what is actually in the type we want
		// there may be easier ways of doing it, but it should be definitively enforced here
		let podcastForStorage = {
			feedUrl: podcast.feedUrl,
			title: podcast.title,
			description: podcast.description,
			imageUrl: podcast.imageUrl,
			subscribed: podcast.subscribed
		} as Podcast;
		
		// TODO, consistency check for duplicates, update only fields present on incoming object
		storedPodcasts.push(podcastForStorage);

		localStorage['podcasts'] = JSON.stringify(storedPodcasts);
	}

	async getPodcasts(): Promise<Array<Podcast>> {
		let storedPodcasts = localStorage['podcasts'];
		return Promise.resolve(storedPodcasts ? JSON.parse(storedPodcasts) : []);
	}
}