type OpmlPodcast = {
	title?: string,
	feedUrl: string,
	link?: string,
};

export default function parseOpml(opmlContent: string): OpmlPodcast[] {
	const domParser = new DOMParser();

	const parsedDocument = domParser.parseFromString(opmlContent, 'application/xml');

	const outlines = Array.from(parsedDocument.querySelectorAll('outline[type="rss"]'));

	return outlines
	.filter((outline) => outline.attributes.getNamedItem('xmlUrl')?.value)
	.map((outline) => {
		return {
			title: outline.attributes.getNamedItem('title')?.value,
			feedUrl: outline.attributes.getNamedItem('xmlUrl')?.value || '',
			link: outline.attributes.getNamedItem('htmlUrl')?.value,
		}
	});
}