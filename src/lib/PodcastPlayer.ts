import { RangeValue } from '@ionic/core';
import { Destination, Value } from './OfflineStorageHandler';
import PodcastController, { PodcastsControllerImplementation, EpisodeView } from './PodcastsController'

export type PodcastPlayerState = {
	hasMedia: boolean,
	isPlaying: boolean,
	duration?: number,
	currentTime?: number,
	episode?: EpisodeView
}

export default interface PodcastPlayer {
	setCurrentTime(value: number): void;
	pause(): void;
	resume(): void;
	play(episode: EpisodeView): void;
	getPlayerState(): PodcastPlayerState;
	readonly episode?: EpisodeView;
}

export interface PodcastPlayerObserver {
	stateChanged(): void
}

export class PodcastPlayerSingleton implements PodcastPlayer {
	private podcastController: PodcastController = new PodcastsControllerImplementation();
	private static instance: PodcastPlayerSingleton;
	private audio: HTMLAudioElement | undefined;
	private _episode?: EpisodeView;

	private constructor() {

	}

	play(episode: EpisodeView): void {
		if(!episode.enclosure) {
			throw new Error('Episodes without enclosure cannot be played');
		}
		
		if(this.audio) {
			// https://stackoverflow.com/a/28060352/4274827
			this.audio.pause();
			this.audio.removeAttribute('src');
			this.audio.load();
		}
		else {
			this.audio = new Audio();
		}
		
		this._episode = episode;
		this.audio.src = episode.enclosure?.url;
		this.audio.currentTime = episode.position || 0;
		this.audio.play();

		this.setMediaSessionMetadata();
	}

	pause() {
		this.audio?.pause();
	}

	resume() {
		this.audio?.play();
	}

	setCurrentTime(currentTime: number): void {
		this.audio && (this.audio.currentTime = currentTime);
	}

	setMediaSessionMetadata() {
		let navigator: any = window.navigator;
		if(this._episode && 'mediaSession' in window.navigator) {
			// @ts-ignore
			navigator.mediaSession.metadata = new MediaMetadata({
				title: this._episode.title,
				// TODO: add podcast data to the player
				// artist: this._episode.,
				artwork: [
					{ src: this._episode.imageUrl, sizes: '512x512'},
				]
			});
		}
	}

	get episode() {
		return this._episode;
	}

	getPlayerState(): PodcastPlayerState {
		return {
			hasMedia: this.audio !== undefined,
			isPlaying: this.audio ? !this.audio.paused : false,
			duration: this.audio ? this.audio.duration : 0,
			currentTime: this.audio ? this.audio.currentTime : 0,
			episode: this._episode
		}
	}

	static getInstance(): PodcastPlayerSingleton {
		return this.instance || (this.instance = new PodcastPlayerSingleton())
	}
}

setInterval(() => {
	// To be changed later
	// it should react to state changes on the player
	let podcastController: PodcastController = new PodcastsControllerImplementation();
	let podcastPlayer: PodcastPlayer = PodcastPlayerSingleton.getInstance();
	let playerState = podcastPlayer.getPlayerState();
	
	if(playerState.isPlaying) {
		podcastController.updateEpisodeCurrentTime(playerState.episode?.id as number, playerState.currentTime as number);
	}

	// WebMonetization using Probabilistic Revenue Share
	if(playerState.episode && playerState.isPlaying) {
		podcastController.getPodcastById(playerState.episode?.podcastId).then((podcast) => {
			let value = podcast?.value && podcast?.value.find((value) => value.model.type === "webmonetization");
			let pointer = pickPointer(value?.destinations || []);
			updateWebMonetization(pointer);
		})
	}
	else {
		updateWebMonetization(undefined);
	}
}, 5000);

function pickPointer(destinations: Destination[]): string | undefined {
	let destinationsCopy: Destination[] = []
	destinationsCopy.push(...destinations);
	
	destinationsCopy.push({
		name: 'podStation',
		address: '$ilp.uphold.com/z88hNfhJ9L6P',
		split: 1
	});

	// based on https://webmonetization.org/docs/probabilistic-rev-sharing/
	const sum = destinationsCopy.reduce((sum, destination) => sum + ensureInt(destination.split), 0);
	let choice = Math.random() * sum;

	for(const key in destinationsCopy) {
		const destination = destinationsCopy[key];
		if((choice -= (destination.split || 0)) <= 0) {
			return destination.address;
		}
	}
}

function ensureInt(value: string | number | undefined): number {
	let result: number
	
	switch(typeof value) {
		case 'string':
			result = parseInt(value);
			break;
		case 'number':
			result = value;
			break;
		default:
			result = 0;
	}

	return Math.max(result, 0);
}

function updateWebMonetization(pointer: string | undefined) {
	let monetizationTag = document.querySelector('meta[name="monetization"]');
	
	if(pointer) {
		if(monetizationTag) {
			monetizationTag.setAttribute('content', pointer);
		}
		else {
			monetizationTag = document.createElement('meta');
			monetizationTag.setAttribute('name', 'monetization');
			monetizationTag.setAttribute('content', pointer);
			document.head.appendChild(monetizationTag);
		}
	}
	else if(monetizationTag) {
		monetizationTag.remove();
	}
}