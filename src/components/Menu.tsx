import {
	IonContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuToggle,
	IonNote,
} from '@ionic/react';

import React from 'react';
import { useLocation } from 'react-router-dom';
import { searchOutline, searchSharp, homeOutline, homeSharp, gitBranchOutline, logoRss, helpCircleSharp, helpCircleOutline, cashOutline, cashSharp, playSharp, playOutline, settingsOutline, settingsSharp } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
	url: string;
	iosIcon: string;
	mdIcon: string;
	title: string;
	}

const appPages: AppPage[] = [
	{
		title: 'Home',
		url: '/page/Home',
		iosIcon: homeOutline,
		mdIcon: homeSharp
	},
	{
		title: 'Search Podcast',
		url: '/page/AddPodcast',
		iosIcon: searchOutline,
		mdIcon: searchSharp
	},
	{
		title: 'Your Podcasts',
		url: '/page/Podcasts',
		iosIcon: logoRss,
		mdIcon: logoRss
	},
	{
		title: 'In progress',
		url: '/page/InProgress',
		iosIcon: playOutline,
		mdIcon: playSharp
	},
	{
		title: 'Fund it',
		url: '/page/FundIt',
		iosIcon: cashOutline,
		mdIcon: cashSharp
	},
	{
		title: 'Settings',
		url: '/page/Settings',
		iosIcon: settingsOutline,
		mdIcon: settingsSharp
	},
	{
		title: 'About',
		url: '/page/About',
		iosIcon: helpCircleOutline,
		mdIcon: helpCircleSharp
	},
];

const Menu: React.FC = () => {
	const location = useLocation();

	return (
		<IonMenu contentId="main" type="overlay">
			<IonContent>
				<IonList id="inbox-list">
				{appPages.map((appPage, index) => {
					return (
					<IonMenuToggle key={index} autoHide={false}>
						<IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
						<IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
						<IonLabel>{appPage.title}</IonLabel>
						</IonItem>
					</IonMenuToggle>
					);
				})}
				</IonList>
			</IonContent>
		</IonMenu>
	);
};

export default Menu;
