import OfflineStorageHandler, { OfflineStorageHandlerImplementation, Podcast, Episode } from './OfflineStorageHandler';
import PodcastindexOrgClient, { PodcastIndexOrgClientImplementation } from './PodcastindexOrgClient';

export type PodcastView = Podcast;

type PodcastToAdd = {
	feedUrl: string,
	title?: string,
	description?: string,
	imageUrl?: string,
	subscribed: boolean
	externalIds?: [{
		type: 'itunes' | 'podcastindexorg',
		id: string
	}]
}

export type EpisodeView = Episode;

export default interface PodcastsController {
	addPodcast(podcast: PodcastToAdd): Promise<void>;
	getPodcasts(): Promise<Array<PodcastView>>;
	getPodcast(feedUrl: string): Promise<PodcastView | undefined>;
	getEpisodes(feedUrl: string): Promise<EpisodeView[]>;
}

export class PodcastsControllerImplementation implements PodcastsController {
	offlineStorageHandler: OfflineStorageHandler = new OfflineStorageHandlerImplementation();
	podcastIndexOrgClient: PodcastindexOrgClient = new PodcastIndexOrgClientImplementation();

	async addPodcast(podcast: PodcastToAdd): Promise<void> {
		let podcastId = await this.offlineStorageHandler.addPodcast({
			...podcast,
			status: 'new'
		});

		let episodes = await this.podcastIndexOrgClient.getEpisodes(podcast.feedUrl);

		await this.offlineStorageHandler.storeEpisodes(episodes.map((episode) => {
			return {
				podcastId: podcastId,
				title: episode.title,
				link: episode.link,
				description: episode.description,
				pubDate: new Date(episode.pubDate),
				imageUrl: episode.imageUrl,
				enclosure: episode.enclosure && {
					url: episode.enclosure.url,
					length: episode.enclosure.length,
					type: episode.enclosure.type
				},
				externalIds: [{
					type: 'podcastindexorg',
					id: episode.id.toString()
				}],
				guid: episode.guid,
			};
		}));

		await this.offlineStorageHandler.updatePodcast({
			id: podcastId,
			status: 'processed',
		});
	}

	async getPodcasts(): Promise<Array<PodcastView>> {
		return (await this.offlineStorageHandler.getPodcasts()).map((storedPodcast) => {
			return {
				...storedPodcast,
				id: storedPodcast.id as number,
				title: storedPodcast.title ? storedPodcast.title : storedPodcast.feedUrl
			}
		});
	}

	async getPodcast(feedUrl: string): Promise<PodcastView | undefined> {
		return this.offlineStorageHandler.getPodcast(feedUrl);
	}

	async getEpisodes(feedUrl: string): Promise<EpisodeView[]> {
		let podcast = await this.offlineStorageHandler.getPodcast(feedUrl);

		return podcast ? this.offlineStorageHandler.getEpisodes(podcast.id) : [];
	}
}