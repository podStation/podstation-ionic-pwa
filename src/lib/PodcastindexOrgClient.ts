export type Episode = {
	title: string,
	description: string,
	enclosureUrl: string,
	imageUrl: string
}

export default interface PodcastindexOrgClient {
	getEpisodes(feedUrl: string): Promise<Array<Episode>> 
}

export class PodcastIndexOrgClientImplementation implements PodcastindexOrgClient{
	private static readonly AUTH_KEY = 'NUKSUA3RXTJ8AEQPHCNP';
	private static readonly AUTH_SECRET = 'BufqJNuREeuP2ThUMUq55z2A3peQt#bsw$Zdsvc3';

	async getEpisodes(feedUrl: string): Promise<Array<Episode>> {
		let response = await fetch(`https://api.podcastindex.org/api/1.0/episodes/byfeedurl?max=10000&url=${feedUrl}`, {
			headers: await PodcastIndexOrgClientImplementation.buildHeaders()
		});

		let jsonResponse = await response.json();

		return jsonResponse.items.map((item: any) => {
			return {
				title: item.title,
				description: item.description,
				enclosureUrl: item.enclosureUrl,
				imageUrl: item.image
			} as Episode
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