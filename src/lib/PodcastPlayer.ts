import { RangeValue } from '@ionic/core';
import { EpisodeView } from './PodcastsController'

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
		this.audio.play();
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