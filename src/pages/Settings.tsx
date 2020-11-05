import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import OfflineStorageHandler, { OfflineStorageHandlerImplementation } from '../lib/OfflineStorageHandler';
import PageWithFooter from './PageWithFooter';

type SettingsState = {
}

export default class SettingsPage extends React.Component<{}, SettingsState> {
	offlineStorageHandler: OfflineStorageHandler = new OfflineStorageHandlerImplementation();
	
	constructor(props: SettingsState) {
		super(props);
		this.state = {}
	}

	handleClickReset(e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>): void {
		this.offlineStorageHandler.deleteDatabase();
	}

	render() {
		return (
			<PageWithFooter>
				<IonHeader>
					<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Settings</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent fullscreen>
					<IonButton onClick={(e) => this.handleClickReset(e)}>Reset</IonButton>
				</IonContent>
			</PageWithFooter>
		);
	}
}