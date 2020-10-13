import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonImg, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRange, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import FooterPlayer from '../components/FooterPlayer'

export default class PageWithFooter extends React.Component<{}, {}> {
	render() {
		return (
			<IonPage>
				{this.props.children}
				<FooterPlayer/>
			</IonPage>
		);
	}
}