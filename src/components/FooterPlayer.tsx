import { IonButton, IonFooter, IonImg, IonLabel, IonRange, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { RangeChangeEventDetail } from '@ionic/core'
import React from 'react';
import PodcastPlayer, {PodcastPlayerState, PodcastPlayerSingleton} from '../lib/PodcastPlayer'

export default class FooterPlayer extends React.Component<{}, PodcastPlayerState> {
	private podcastPlayer: PodcastPlayer = PodcastPlayerSingleton.getInstance();
	private timeout?: NodeJS.Timeout;

	constructor() {
		super({});
		this.state = this.podcastPlayer.getPlayerState();
	}

	componentDidMount() {
		this.timeout = setInterval(() => {
			this.setState(this.podcastPlayer.getPlayerState());
		}, 1000);
	}

	componentWillUnmount() {
		this.timeout && clearInterval(this.timeout);
	}

	handleClickPause() {
		this.podcastPlayer.pause();
		this.setState(this.podcastPlayer.getPlayerState());
	}

	handleClickPlay() {
		this.podcastPlayer.resume();
		this.setState(this.podcastPlayer.getPlayerState());
	}

	handleRangeChanged(e: CustomEvent<RangeChangeEventDetail>): void {
		// 1. When starting a new podcast I saw the event being raised
		// with value = NaN
		// 2. updates in state seem to trigger the change event
		// we want to avoid setting the current time in this cases, as it
		// causes stutter in the audio
		if(typeof e.detail.value === 'number' && isNaN(e.detail.value) && e.detail.value !== this.state.currentTime) {
			this.podcastPlayer.setCurrentTime(e.detail.value as number);
			this.setState(this.podcastPlayer.getPlayerState());
		}
	}

	private static timeFormatter(seconds: number): string {
		// https://stackoverflow.com/a/25279399/4274827
		let date = new Date(0);
		date.setSeconds(seconds);
		return date.toISOString().substr(11, 8);
	}

	render() {
		return (
			<IonFooter>
				{this.state.episode &&
					<IonToolbar>
						<IonThumbnail slot="start">
							<IonImg src={this.state.episode.imageUrl}/>
						</IonThumbnail>
						<IonTitle>{this.state.episode.title}</IonTitle>
						<IonRange min={0} max={this.state.duration} value={this.state.currentTime} onIonChange={(e) => this.handleRangeChanged(e)}>
							<IonLabel slot="start">{FooterPlayer.timeFormatter(this.state.currentTime || 0)}</IonLabel>
							<IonLabel slot="end">{FooterPlayer.timeFormatter(this.state.duration || 0)}</IonLabel>
						</IonRange>
						{this.state.isPlaying && <IonButton slot="end" onClick={() => this.handleClickPause()}>Pause</IonButton>}
						{!this.state.isPlaying && <IonButton slot="end" onClick={() => this.handleClickPlay()}>Play</IonButton>}
					</IonToolbar>
				}
			</IonFooter>
		);
	}
}