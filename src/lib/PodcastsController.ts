import OfflineStorageHandler, { OfflineStorageHandlerImplementation, Podcast, Episode } from './OfflineStorageHandler';
import PodcastindexOrgClient, { PodcastIndexOrgClientImplementation, Episode as PodcastIndexOrgEpisode } from './PodcastindexOrgClient';

export type PodcastView = Podcast;

type PodcastToAdd = {
	feedUrl: string,
	title?: string,
	description?: string,
	imageUrl?: string,
	subscribed: boolean
	podcastIndexOrgId?: number
}

export type EpisodeView = Episode;

export default interface PodcastsController {
	addPodcast(podcast: PodcastToAdd): Promise<void>;
	getPodcasts(): Promise<Array<PodcastView>>;
	getPodcast(feedUrl: string): Promise<PodcastView | undefined>;
	updatePodcasts(): Promise<void>;
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

		await this.offlineStorageHandler.putEpisodes(episodes.map((episode) => {
			return {
				...this.mapPodcastIndexOrgEpisodeToStorage(episode),
				podcastId: podcastId,
			};
		}));

		await this.offlineStorageHandler.updatePodcast({
			id: podcastId,
			status: 'processed',
			podcastIndexOrgLastEpisodeFetch: new Date()
		});
	}

	private mapPodcastIndexOrgEpisodeToStorage(podcastIndexOrgEpisode: PodcastIndexOrgEpisode): Omit<Episode, 'podcastId'> {
		return {
			title: podcastIndexOrgEpisode.title,
			link: podcastIndexOrgEpisode.link,
			description: podcastIndexOrgEpisode.description,
			pubDate: new Date(podcastIndexOrgEpisode.pubDate),
			imageUrl: podcastIndexOrgEpisode.imageUrl,
			enclosure: podcastIndexOrgEpisode.enclosure && {
				url: podcastIndexOrgEpisode.enclosure.url,
				length: podcastIndexOrgEpisode.enclosure.length,
				type: podcastIndexOrgEpisode.enclosure.type
			},
			guid: podcastIndexOrgEpisode.guid,
			podcastIndexOrgId: podcastIndexOrgEpisode.id,
		};
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

	async updatePodcasts(): Promise<void> {
		let podcasts = await this.offlineStorageHandler.getPodcasts();

		for(let key in podcasts) {
			let podcast = podcasts[key];
			let episodes = await this.podcastIndexOrgClient.getEpisodes(podcast.feedUrl);
			let storedEpisodes = await this.getEpisodes(podcast.feedUrl);

			episodes.forEach((episode) => {
				let matchIndex = storedEpisodes.findIndex((storedEpisode) => {
					return storedEpisode.podcastIndexOrgId === episode.id;
				});

				if(matchIndex >= 0) {
					storedEpisodes[matchIndex] = {
						...storedEpisodes[matchIndex],
						...this.mapPodcastIndexOrgEpisodeToStorage(episode),
					}
				}
				else {
					storedEpisodes.push({
						...this.mapPodcastIndexOrgEpisodeToStorage(episode),
						podcastId: podcast.id as number
					})
				}
			});

			this.offlineStorageHandler.putEpisodes(storedEpisodes);
		}
	}

	async getEpisodes(feedUrl: string): Promise<EpisodeView[]> {
		let podcast = await this.offlineStorageHandler.getPodcast(feedUrl);

		return podcast ? this.offlineStorageHandler.getEpisodes(podcast.id) : [];
	}
}