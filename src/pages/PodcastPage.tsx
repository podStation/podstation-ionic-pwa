import { IonButton, IonButtons, IonContent, IonHeader, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import PodcastsController, {PodcastsControllerImplementation, PodcastView, EpisodeView } from '../lib/PodcastsController';
import { RouteComponentProps } from "react-router-dom";
import { PodcastPlayerSingleton } from '../lib/PodcastPlayer'
import PageWithFooter from './PageWithFooter';
import EpisodeItem from '../components/EpisodeItem';

interface PodcastPageProps extends RouteComponentProps<{
	encodedFeedUrl: string;
}> {};

type PodcastPageState = {
	podcast?: PodcastView,
	episodes?: EpisodeView[]
}

export default class PodcastPage extends React.Component<PodcastPageProps, PodcastPageState> {
	private podcastsController: PodcastsController = new PodcastsControllerImplementation();
	private allEpisodes: EpisodeView[] = [];
	private lastItemToRender = 20;

	constructor(props: PodcastPageProps) {
		super(props);
		this.state = {}
	}
	
	async componentDidMount() {
		const feedUrl = atob(decodeURIComponent(this.props.match.params.encodedFeedUrl));
		this.setState({
			podcast: await this.podcastsController.getPodcast(feedUrl)
		});

		this.allEpisodes = await this.podcastsController.getEpisodes(feedUrl);

		this.setState({
			episodes: this.allEpisodes.slice(0, this.lastItemToRender + 1)
		});
	}

	handleInfiniteScroll(e: CustomEvent<void>) {
		this.lastItemToRender += 20;

		this.lastItemToRender = Math.min(this.lastItemToRender, this.allEpisodes.length);
		
		this.setState({
			episodes: this.allEpisodes.slice(0, this.lastItemToRender + 1)
		});

		(e.target as HTMLIonInfiniteScrollElement).complete();
	}

	render() {
		return (
			<PageWithFooter>
				<IonHeader>
					<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonThumbnail slot="start">
						<IonImg src={this.state.podcast && this.state.podcast.imageUrl}/>
					</IonThumbnail>
					<IonTitle>{this.state.podcast && this.state.podcast.title}</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent fullscreen>
					<IonList>
						{this.state.episodes && this.state.episodes.map((episode) => (
							<EpisodeItem episode={episode}/>
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