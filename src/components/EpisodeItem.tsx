import { IonButton, IonImg, IonItem, IonLabel, IonThumbnail } from '@ionic/react';
import React from 'react';
import { PodcastPlayerSingleton } from '../lib/PodcastPlayer';
import { EpisodeView, PodcastView } from '../lib/PodcastsController';

type EpisodeItemProps = {
	showThumbnail?: boolean,
	episode: EpisodeView,
	podcast?: PodcastView
}

export default class EpisodeItem extends React.Component<EpisodeItemProps> {
	handleClickPlay(e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>): void {
		const podcastPlayer = PodcastPlayerSingleton.getInstance();

		podcastPlayer.play(this.props.episode);
	}
	
	render() {
		return (
		<IonItem>
			{
				this.props.showThumbnail && 
				<IonThumbnail slot="start">
					{this.props.podcast?.imageUrl && <IonImg src={this.props.podcast.imageUrl}/>}
				</IonThumbnail>
			}
			<IonLabel>
				<h2>{this.props.episode.title}</h2>
				{this.props.podcast && <h3>{this.props.podcast.title}</h3>}
				<p>{this.props.episode.description}</p>
			</IonLabel>
			<IonButton slot="end" onClick={e => this.handleClickPlay(e)}>Play</IonButton>
		</IonItem>
		)
	}
}