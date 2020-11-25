import { IonButtons, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonList, IonMenuButton, IonRefresher, IonRefresherContent, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import React from 'react';
import PodcastsController, {PodcastsControllerImplementation, PodcastView} from '../lib/PodcastsController';
import PageWithFooter from './PageWithFooter';
import ImgWithFallBack from '../components/ImgWithFallback';

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

	async doRefresh(e: CustomEvent<RefresherEventDetail>) {
		await this.podcastsController.updatePodcasts();
		e.detail.complete();
	}

	render() {
		return (
			<PageWithFooter>
				<IonHeader>
					<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Your Podcasts</IonTitle>
					</IonToolbar>
				</IonHeader>
	
				<IonContent fullscreen>
					<IonRefresher slot="fixed" onIonRefresh={(e) => this.doRefresh(e)}>
						<IonRefresherContent pullingText="Pull to refresh"></IonRefresherContent>
					</IonRefresher>
					<IonList>
						{this.state.podcasts.map((podcast) => (
							<IonItem routerLink={`/page/Podcast/feed/${encodeURIComponent(btoa(podcast.feedUrl))}`}>
								<IonThumbnail slot="start">
									{podcast.imageUrl && <ImgWithFallBack src={podcast.imageUrl}/>}
								</IonThumbnail>
								<IonLabel>
									<h2>{podcast.title}</h2>
									<p>{podcast.description}</p>
								</IonLabel>
							</IonItem>
						))}
					</IonList>
				</IonContent>
			</PageWithFooter>
		);
	}
}