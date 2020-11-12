import { IonButtons, IonContent, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import PodcastsController, {PodcastsControllerImplementation, EpisodeWithPodcastView } from '../lib/PodcastsController';
import PageWithFooter from './PageWithFooter';
import EpisodeItem from '../components/EpisodeItem';

type EpisodesPageState = {
	episodes: EpisodeWithPodcastView[]
}

export default class EpisodesPage extends React.Component<{}, EpisodesPageState> {
	private static readonly EPISODES_PER_PAGE: number = 20;
	private podcastsController: PodcastsController = new PodcastsControllerImplementation();

	constructor(props: {}) {
		super(props);
		this.state = {
			episodes:[]
		}
	}
	
	async componentDidMount() {
		// Maximum date, see https://stackoverflow.com/a/43794682/4274827
		const episodes = await this.podcastsController.getAllEpisodes(EpisodesPage.EPISODES_PER_PAGE, new Date(8640000000000000));
		
		this.setState({
			episodes: episodes
		});
	}

	async handleInfiniteScroll(e: CustomEvent<void>) {
		if(this.state.episodes.length) {
			const lastShownEpisode = this.state.episodes[this.state.episodes.length - 1];

			// TODO: What to do with items without pubDate?
			const episodes = await this.podcastsController.getAllEpisodes(EpisodesPage.EPISODES_PER_PAGE, lastShownEpisode.pubDate || new Date());

			if(episodes[0].id === lastShownEpisode.id) {
				episodes.splice(0, 1);
			}

			this.setState({
				episodes: [...this.state.episodes, ...episodes]
			});

			(e.target as HTMLIonInfiniteScrollElement).complete();
		}
		
	}

	render() {
		return (
			<PageWithFooter>
				<IonHeader>
					<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Episodes</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent fullscreen>
					<IonList>
						{this.state.episodes && this.state.episodes.map((episode) => (
							<EpisodeItem showThumbnail={true} episode={episode} podcast={episode.podcast}/>
						))}
					</IonList>
					<IonInfiniteScroll onIonInfinite={e => this.handleInfiniteScroll(e)}>
						<IonInfiniteScrollContent></IonInfiniteScrollContent>
					</IonInfiniteScroll>
				</IonContent>
			</PageWithFooter>
		);
	}
}