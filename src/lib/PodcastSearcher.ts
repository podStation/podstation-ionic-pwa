export default class PodcastSearcher {
	search(searchTerms: string, resultCallback: (result: PodcastSearchResult) => void) {
		this.searchPodcastindexOrg(searchTerms).then((podcasts) => {
			resultCallback({
				items: podcasts
			});
		});
	}

	private async searchPodcastindexOrg(searchTerms: string): Promise<PodcastSearchResultItem[]> {
		const AUTH_KEY = 'NUKSUA3RXTJ8AEQPHCNP';
		const AUTH_SECRET = 'BufqJNuREeuP2ThUMUq55z2A3peQt#bsw$Zdsvc3';
		const authDate = Math.floor((new Date()).valueOf() / 1000);

		let response = await fetch('https://api.podcastindex.org/api/1.0/search/byterm?q=' + searchTerms, { 
			headers: {
				'X-Auth-Date': authDate.toString(),
				'X-Auth-Key': AUTH_KEY,
				'User-Agent': 'podStation',
				'Authorization': await PodcastSearcher.hashPodcastindexOrgAuthorization(AUTH_KEY + AUTH_SECRET + authDate)
			}
		});

		let jsonResponse = await response.json();

		return jsonResponse.feeds.map((feed: any) => {
			return {
				feedUrl: feed.url,
				title: feed.title,
				imageUrl: feed.image,
				description: feed.description,
				podcastIndexOrgId: feed.id
			}
		});
	}

	static async hashPodcastindexOrgAuthorization(plainTextAuthorization: string): Promise<string> {
		const digestArrayBuffer = await window.crypto.subtle.digest('SHA-1', (new window.TextEncoder()).encode(plainTextAuthorization));
		return PodcastSearcher.buf2hex(digestArrayBuffer);
	}

	static buf2hex(buffer: ArrayBuffer): string {
		return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
	}
}

export type PodcastSearchResult = {
	items: PodcastSearchResultItem[];
}

export type PodcastSearchResultItem = {
	feedUrl: string;
	title: string;
	description: string;
	imageUrl: string;
	podcastIndexOrgId?: number,
}