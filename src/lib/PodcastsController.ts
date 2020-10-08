import OfflineStorageHandler, { OfflineStorageHandlerImplementation } from './OfflineStorageHandler'

export type PodcastView = {
	feedUrl: string,
	title: string,
	description?: string,
	imageUrl?: string,
	subscribed: boolean,
}

export default interface PodcastsController {
	getPodcasts(): Promise<Array<PodcastView>>;
	getPodcast(feedUrl: string): Promise<PodcastView | undefined>;
}

export class PodcastsControllerImplementation implements PodcastsController {
	offlineStorageHandler: OfflineStorageHandler = new OfflineStorageHandlerImplementation();

	async getPodcasts(): Promise<Array<PodcastView>> {
		return (await this.offlineStorageHandler.getPodcasts()).map((storedPodcast) => {
			return {
				...storedPodcast,
				title: storedPodcast.title ? storedPodcast.title : storedPodcast.feedUrl
			}
		});
	}

	async getPodcast(feedUrl: string): Promise<PodcastView | undefined> {
		return (await this.getPodcasts()).find((podcastView) => podcastView.feedUrl === feedUrl);
	}
}