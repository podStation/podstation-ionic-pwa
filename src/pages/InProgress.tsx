import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import PodcastsController, {PodcastsControllerImplementation, EpisodeView, EpisodeWithPodcastView } from '../lib/PodcastsController';
import { PodcastPlayerSingleton } from '../lib/PodcastPlayer'
import PageWithFooter from './PageWithFooter';
import { playOutline, playSharp } from 'ionicons/icons';
import { EOPNOTSUPP } from 'constants';

type InProgressPageState = {
	episodes?: EpisodeWithPodcastView[]
}

export default class InProgressPage extends React.Component<{}, InProgressPageState> {
	private podcastsController: PodcastsController = new PodcastsControllerImplementation();
	private allEpisodes: EpisodeWithPodcastView[] = [];
	private lastItemToRender = 20;

	constructor(props: InProgressPageState) {
		super(props);
		this.state = {}
	}
	
	async componentDidMount() {
		this.allEpisodes = await this.podcastsController.getEpisodesInProgress();

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
					<IonTitle>In Progress</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent fullscreen>
					<IonList>
						{this.state.episodes && this.state.episodes.map((episode) => (
							<IonItem>
								<IonThumbnail slot="start">
									{episode.podcast.imageUrl && <IonImg src={episode.podcast.imageUrl}/>}
								</IonThumbnail>
								<IonLabel>
									<h2>{episode.title}</h2>
									<h3>{episode.podcast.title}</h3>
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