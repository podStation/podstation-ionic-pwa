import Menu from './components/Menu';
import AddPodcastPage from './pages/AddPodcastPage'
import Home from './pages/Home'
import React from 'react';
import { IonApp, IonButton, IonContent, IonFooter, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import PodcastsPage from './pages/PodcastsPage';
import PodcastPage from './pages/PodcastPage';
import About from './pages/About';
import FundIt from './pages/FundIt';
import InProgressPage from './pages/InProgress';
import SettingsPage from './pages/Settings';
import EpisodesPage from './pages/EpisodesPage';

const App: React.FC = () => {
	return (
		<IonApp>
			<IonReactHashRouter>
				<IonSplitPane contentId="main">
				<Menu />
				<IonContent id="main">
					<Switch>
						<Route path="/page/AddPodcast" component={AddPodcastPage} exact />
						<Route path="/page/Home" component={Home} exact />
						<Route path="/page/Podcasts" component={PodcastsPage} exact />
						<Route path="/page/Podcast/feed/:encodedFeedUrl" component={PodcastPage} exact />
						<Route path="/page/Episodes" component={EpisodesPage} exact />
						<Route path="/page/InProgress" component={InProgressPage} exact />
						<Route path="/page/About" component={About} exact />
						<Route path="/page/FundIt" component={FundIt} exact />
						<Route path="/page/Settings" component={SettingsPage} exact />
						<Redirect from="/" to="/page/Home" exact />
					</Switch>
				</IonContent>
				</IonSplitPane>
			</IonReactHashRouter>
		</IonApp>
	);
};

export default App;
