export default interface SubscriptionHandler {
	subscribe(feedUrl: String): Promise<void>;

	getSubscriptions(): Promise<Array<Subscription>>;
}

export class SubscriptionHandlerImplementation implements SubscriptionHandler{
	private subscriptions: Array<Subscription> = [];

	async subscribe(feedUrl: string): Promise<void> {
		if(! this.subscriptions.find((subscription) => subscription.feedUrl === feedUrl)) {
			this.subscriptions.push({feedUrl: feedUrl});
		}
		return Promise.resolve();
	}

	async getSubscriptions(): Promise<Array<Subscription>> {
		return Promise.resolve(this.subscriptions);
	}
}

export type Subscription = {
	feedUrl: string;
};