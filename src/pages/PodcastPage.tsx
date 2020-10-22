import { IonButton, IonButtons, IonContent, IonHeader, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import PodcastsController, {PodcastsControllerImplementation, PodcastView, EpisodeView } from '../lib/PodcastsController';
import { RouteComponentProps } from "react-router-dom";
import { PodcastPlayerSingleton } from '../lib/PodcastPlayer'
import PageWithFooter from './PageWithFooter';

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
		this.setState({
			podcast: await this.podcastsController.getPodcast(atob(this.props.match.params.encodedFeedUrl))
		});

		this.allEpisodes = await this.podcastsController.getEpisodes(atob(this.props.match.params.encodedFeedUrl))

		this.setState({
			episodes: this.allEpisodes.slice(0, this.lastItemToRender + 1)
		});
	}

	handleClickPlay(e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, episode: EpisodeView): void {
		const podcastPlayer = PodcastPlayerSingleton.getInstance();

		podcastPlayer.play(episode);
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
							<IonItem>
								<IonLabel>
									<h2>{episode.title}</h2>
									<p>{episode.description}</p>
								</IonLabel>
								<IonButton slot="end" onClick={e => this.handleClickPlay(e, episode)}>Play</IonButton>
							</IonItem>
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