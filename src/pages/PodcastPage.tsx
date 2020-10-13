import { IonButton, IonButtons, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import PodcastsController, {PodcastsControllerImplementation, PodcastView} from '../lib/PodcastsController';
import { RouteComponentProps } from "react-router-dom";
import PodcastindexOrgClient, { PodcastIndexOrgClientImplementation, Episode } from '../lib/PodcastindexOrgClient';
import PodcastPlayer, { PodcastPlayerSingleton } from '../lib/PodcastPlayer'
import PageWithFooter from './PageWithFooter';

interface PodcastPageProps extends RouteComponentProps<{
	encodedFeedUrl: string;
}> {};

type PodcastPageState = {
	podcast?: PodcastView,
	episodes?: Array<Episode>
}

export default class PodcastPage extends React.Component<PodcastPageProps, PodcastPageState> {
	podcastsController: PodcastsController = new PodcastsControllerImplementation();
	podcastindexOrgClient: PodcastindexOrgClient = new PodcastIndexOrgClientImplementation();

	constructor(props: PodcastPageProps) {
		super(props);
		this.state = {}
	}
	
	async componentDidMount() {
		this.setState({
			podcast: await this.podcastsController.getPodcast(atob(this.props.match.params.encodedFeedUrl))
		});

		this.setState({
			episodes: await this.podcastindexOrgClient.getEpisodes(atob(this.props.match.params.encodedFeedUrl))
		})
	}

	handleClickSubscribe(e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, episode: Episode): void {
		const podcastPlayer = PodcastPlayerSingleton.getInstance();

		podcastPlayer.play(episode);
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
								<IonButton slot="end" onClick={e => this.handleClickSubscribe(e, episode)}>Play</IonButton>
							</IonItem>
						))}
					</IonList>
				</IonContent>
			</PageWithFooter>
		);
	}
}