import PodcastsController, {PodcastsControllerImplementation} from './PodcastsController'

export type Podcast = {
	feedUrl: string,
	title?: string,
	description?: string,
	imageUrl?: string
}

export type Subscription = {
	feedUrl: string;
};

export default interface SubscriptionHandler {
	subscribe(podcast: Podcast): Promise<void>;

	getSubscriptions(): Promise<Array<Subscription>>;
}

export class SubscriptionHandlerImplementation implements SubscriptionHandler{
	private podcastsController: PodcastsController = new PodcastsControllerImplementation();

	async subscribe(podcast: Podcast): Promise<void> {
		return this.podcastsController.addPodcast({
			...podcast,
			subscribed: true
		});
	}

	async getSubscriptions(): Promise<Array<Subscription>> {
		let storedPodcasts = await this.podcastsController.getPodcasts();
		
		return Promise.resolve((storedPodcasts).filter((podcast) => podcast.subscribed));
	}
}