export type Destination = {
	name: string,
	type: string,
	address: string,
	split: number
}

export type Podcast = {
	id: number,
	title: string,
	description: string,
	link: string,
	imageUrl: string,
	value: {
		model: {
			type: string
			method: string,
			suggested: string,
		},
		destinations: Destination[]
	}
}

export type Episode = {
	id: number,
	title: string,
	link: string,
	description: string,
	pubDate: number,
	enclosure: {
		url: string,
		length: number,
		type: string,
	},
	guid: string,
	imageUrl: string,
}

export default interface PodcastindexOrgClient {
	getPodcastByFeedUrl(feedUrl: string): Promise<Podcast>
	getEpisodes(feedUrl: string): Promise<Array<Episode>> 
}

export class PodcastIndexOrgClientImplementation implements PodcastindexOrgClient{
	private static readonly AUTH_KEY = 'NUKSUA3RXTJ8AEQPHCNP';
	private static readonly AUTH_SECRET = 'BufqJNuREeuP2ThUMUq55z2A3peQt#bsw$Zdsvc3';

	async getPodcastByFeedUrl(feedUrl: string): Promise<Podcast> {
		const response = await fetch(`https://api.podcastindex.org/api/1.0/podcasts/byfeedurl?url=${feedUrl}`, {
			headers: await PodcastIndexOrgClientImplementation.buildHeaders()
		});

		const jsonResponse = await response.json();

		return {
			id: jsonResponse.feed.id,
			title: jsonResponse.feed.title,
			description: jsonResponse.feed.title,
			link: jsonResponse.feed.link,
			imageUrl: jsonResponse.feed.image,
			value: jsonResponse.feed.value
		}
	}

	async getEpisodes(feedUrl: string): Promise<Array<Episode>> {
		let response = await fetch(`https://api.podcastindex.org/api/1.0/episodes/byfeedurl?max=10000&url=${feedUrl}`, {
			headers: await PodcastIndexOrgClientImplementation.buildHeaders()
		});

		let jsonResponse = await response.json();

		return jsonResponse.items.map((item: any) => {
			let episode: Episode = {
				id: item.id,
				title: item.title,
				link: item.link,
				description: item.description,
				pubDate: item.datePublished,
				enclosure: {
					url: item.enclosureUrl,
					length: item.enclosureLength,
					type: item.enclosureType
				},
				guid: item.guid,
				imageUrl: item.image
			}

			return episode;
		})
	}

	private static async buildHeaders(): Promise<Record<string, string>> {
		const authDate = Math.floor((new Date()).valueOf() / 1000);

		return {
			'X-Auth-Date': authDate.toString(),
			'X-Auth-Key': this.AUTH_KEY,
			'User-Agent': 'podStation',
			'Authorization': await PodcastIndexOrgClientImplementation.buildAuthorizationHeader(authDate.toString())
		}
	}

	private static async buildAuthorizationHeader(authDate: string): Promise<string> { 
		return this.hashPodcastindexOrgAuthorization(this.AUTH_KEY + this.AUTH_SECRET + authDate);
	}

	private static async hashPodcastindexOrgAuthorization(plainTextAuthorization: string): Promise<string> {
		const digestArrayBuffer = await window.crypto.subtle.digest('SHA-1', (new window.TextEncoder()).encode(plainTextAuthorization));
		return PodcastIndexOrgClientImplementation.buf2hex(digestArrayBuffer);
	}

	private static buf2hex(buffer: ArrayBuffer): string {
		return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
	}
}