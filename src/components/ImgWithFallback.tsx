import { IonImg } from '@ionic/react';
import React from 'react';

type ImgWithFallbackProps = {
	src?: string
}

type ImageWithFallbackState = {
	imageLoadFailed: boolean
}

export default class ImgWithFallBack extends React.Component<ImgWithFallbackProps, ImageWithFallbackState> {

	constructor(props: ImgWithFallbackProps) {
		super(props);

		this.state = {
			imageLoadFailed: false
		}
	}

	private handleImageError() {
		this.setState({
			imageLoadFailed: true
		});
	}

	private imageSource(): string | undefined {
		return this.state.imageLoadFailed ? '/assets/img/rss-alt.svg' : this.props.src;
	}

	render() {
		return <IonImg onIonError={() => this.handleImageError()} src={this.imageSource()}/>;
	}
}