import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import PageWithFooter from './PageWithFooter';

const FundIt: React.FC = () => {
	const { name } = useParams<{ name: string; }>();

	return (
	<PageWithFooter>
		<IonHeader>
			<IonToolbar>
				<IonButtons slot="start">
					<IonMenuButton />
				</IonButtons>
				<IonTitle>Fund podStation</IonTitle>
			</IonToolbar>
		</IonHeader>

		<IonContent fullscreen>
			<p>podStation is brought to you in a <i>value for value</i> model.</p>
			<p>You decide how much value it brings to you, and compensate it accordingly.</p>
			<p>If you can't fund it, feel free to continue to use it, as its mission is to make podcasts accessible to everyone</p>
			<p>Fund it in <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=DEQFCARLYBXXE" target="_blank">PayPal</a></p> 
		</IonContent>
	</PageWithFooter>
	);
};

export default FundIt;
