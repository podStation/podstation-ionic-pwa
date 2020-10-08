import { IonButtons, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import PodcastsController, {PodcastsControllerImplementation, PodcastView} from '../lib/PodcastsController';

class PodcastsPageState {
	podcasts: Array<PodcastView> = [];
}

export default class PodcastsPage extends React.Component<{}, PodcastsPageState> {
	podcastsController: PodcastsController = new PodcastsControllerImplementation();

	componentWillMount() {
		this.setState(new PodcastsPageState());
	}
	
	async componentDidMount() {
		this.setState({
			podcasts: await this.podcastsController.getPodcasts()
		});
	}

	render() {
		return (
			<IonPage>
				<IonHeader>
					<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Your Podcasts</IonTitle>
					</IonToolbar>
				</IonHeader>
	
				<IonContent fullscreen>
					<IonList>
						{this.state.podcasts.map((podcast) => (
							<IonItem routerLink={`/page/Podcast/feed/${btoa(podcast.feedUrl)}`}>
								<IonThumbnail slot="start">
									{podcast.imageUrl && <IonImg src={podcast.imageUrl}/>}
								</IonThumbnail>
								<IonLabel>
									<h2>{podcast.title}</h2>
									<p>{podcast.description}</p>
								</IonLabel>
							</IonItem>
						))}
					</IonList>
				</IonContent>
			</IonPage>
		);
	}
}