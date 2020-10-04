import OfflineStorageHandler, {OfflineStorageHandlerImplementation} from './OfflineStorageHandler'

export type Podcast = {
	feedUrl: string,
	title?: string,
	description?: string,
	image?: string
}

export type Subscription = {
	feedUrl: string;
};

export default interface SubscriptionHandler {
	subscribe(podcast: Podcast): Promise<void>;

	getSubscriptions(): Promise<Array<Subscription>>;
}

export class SubscriptionHandlerImplementation implements SubscriptionHandler{
	private offlineStorageHandler: OfflineStorageHandler = new OfflineStorageHandlerImplementation();

	async subscribe(podcast: Podcast): Promise<void> {
		this.offlineStorageHandler.storePodcast({
			...podcast,
			subscribed: true
		})
		return Promise.resolve();
	}

	async getSubscriptions(): Promise<Array<Subscription>> {
		let storedPodcasts = await this.offlineStorageHandler.getPodcasts();
		
		return Promise.resolve((storedPodcasts).filter((podcast) => podcast.subscribed));
	}
}