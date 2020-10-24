import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import PageWithFooter from './PageWithFooter';

const About: React.FC = () => {
	const { name } = useParams<{ name: string; }>();

	return (
	<PageWithFooter>
		<IonHeader>
			<IonToolbar>
				<IonButtons slot="start">
					<IonMenuButton />
				</IonButtons>
				<IonTitle>Welcome to podStation</IonTitle>
			</IonToolbar>
		</IonHeader>

		<IonContent fullscreen>
			<p>podStation is planned to be a web application for subscribing and listening to podcasts.</p>
			<p>As you can see, it is still under construction.</p>
			<p>Come back from time to time to see how we are doing.</p>
			<p>Don't get to attached to any functionality or to your data, this may break or change, it is not ready for use yet</p>
			<p>It is an Open Source project, if you want to know more about it, get to <a href="https://github.com/podStation/podstation-ionic-pwa" target="_blank">our github project</a>.</p>
		</IonContent>
	</PageWithFooter>
	);
};

export default About;
