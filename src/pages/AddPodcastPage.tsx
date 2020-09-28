import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem, IonThumbnail, IonImg, IonLabel, IonButton } from '@ionic/react';
import React, { FormEvent, useState } from 'react';
import './Page.css';
import PodcastSearcher, {PodcastSearchResult} from '../lib/PodcastSearcher';

type AddPodcastPageState = {
	podcastSearchResult: PodcastSearchResult,
	searchText: string
};

export default class AddPodcastPage extends React.Component<{}, AddPodcastPageState> {
	handleSubmit(e: FormEvent) {
		e.preventDefault();
		let ps: PodcastSearcher = new PodcastSearcher();

		ps.search(this.state.searchText, (result) => {
			this.setState({
				podcastSearchResult: result
			});
		});
	}

	componentWillMount() {
		this.setState({
			podcastSearchResult: new PodcastSearchResult()
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
				<IonTitle>Add Podcast</IonTitle>
				</IonToolbar>
			</IonHeader>
			

			<IonContent fullscreen>
				<IonHeader collapse="condense">
				<IonToolbar>
					<IonTitle size="large">Add Podcast</IonTitle>
				</IonToolbar>
				</IonHeader>
				<form onSubmit={e => this.handleSubmit(e)}>
					<IonSearchbar value={this.state.searchText} debounce={0} onIonChange={e => this.setSearchText(e.detail.value!)}/>
				</form>
				<IonList>
					{this.state.podcastSearchResult.podcasts.map((podcast) => (
						<IonItem>
							<IonThumbnail slot="start">
								<IonImg src={podcast.imageUrl || podcast.originalImageUrl}/>
							</IonThumbnail>
							<IonLabel>
								<h2>{podcast.title}</h2>
								<p>{podcast.description}</p>
							</IonLabel>
							<IonButton>Subscribe</IonButton>
						</IonItem>
					))}
				</IonList>
			</IonContent>
			</IonPage>
		);
	}
	
	setSearchText(searchText: string): void {
		this.setState({
			searchText: searchText
		});
	}
}