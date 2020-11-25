import { IonButtons, IonContent, IonHeader, IonMenuButton,  IonTitle, IonToolbar, IonSearchbar, IonList, IonItem, IonThumbnail, IonLabel, IonButton } from '@ionic/react';
import React, { FormEvent } from 'react';
import PodcastSearcher, {PodcastSearchResult, PodcastSearchResultItem} from '../lib/PodcastSearcher';
import SubscriptionHandler, { SubscriptionHandlerImplementation, Subscription} from '../lib/SubscriptionHandler';
import PageWithFooter from './PageWithFooter';
import parseOpml from '../lib/OpmlParser'
import ImgWithFallBack from '../components/ImgWithFallback';

type PodcastSearchResultItemWithSubscription = PodcastSearchResultItem & {
	subscribed: boolean;
}

type PodcastSearchResultWithSubscription = {
	items: PodcastSearchResultItemWithSubscription[];
}

type AddPodcastPageState = {
	podcastSearchResult: PodcastSearchResultWithSubscription,
	searchText: string
};

export default class AddPodcastPage extends React.Component<{}, AddPodcastPageState> {
	subscriptionHandler: SubscriptionHandler;

	constructor(props: Readonly<{}>) {
		super(props);

		this.subscriptionHandler = new SubscriptionHandlerImplementation();
		this.state = {
			podcastSearchResult: {
				items: [],
			},
			searchText: ''
		}
	}
	
	handleSearchSubmit(e: FormEvent) {
		e.preventDefault();
		let ps: PodcastSearcher = new PodcastSearcher();

		this.setState({
			podcastSearchResult: {items: []}
		});

		ps.search(this.state.searchText, (result) => {
			let searchResultsWithSubscriptions = this.addDefaultSubscriptionToSearchResults(result);
			
			this.subscriptionHandler.getSubscriptions()
			.then((subscriptions) => {
				this.setState({
					podcastSearchResult: this.adjustSubscriptionInSearchResults(searchResultsWithSubscriptions, subscriptions),
				});
			})
		});
	}

	addDefaultSubscriptionToSearchResults(psr: PodcastSearchResult): PodcastSearchResultWithSubscription {
		return {
			items: psr.items.map((item) => {
				return {
					...item,
					subscribed: false
				}
			})
		}
	}

	handleClickSubscribe(e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>, item: PodcastSearchResultItem): void {
		this.subscriptionHandler.subscribe({
			...item
		})
		.then(() => this.subscriptionHandler.getSubscriptions())
		.then((subscriptions) => {
			this.setState({
				podcastSearchResult: this.adjustSubscriptionInSearchResults(this.state.podcastSearchResult, subscriptions)
			});
		});
	}

	adjustSubscriptionInSearchResults(podcastSearchResult: PodcastSearchResultWithSubscription, subscriptions: Array<Subscription>): PodcastSearchResultWithSubscription {
		return {
			items: podcastSearchResult.items.map((item) => {
				return {
					...item,
					subscribed: subscriptions.find((subscription) => subscription.feedUrl === item.feedUrl ) !== undefined
				}
			})
		};
	}
	
	setSearchText(searchText: string): void {
		this.setState({
			searchText: searchText
		});
	}

	handleClickImportOpml(): void {
		document.getElementById('opmlUploader')?.click();
	}

	handleChangeOpmlUploader(e: React.ChangeEvent<HTMLInputElement>): void {
		const files = e.currentTarget.files;
		const file = files && files[0];

		if(file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				// @ts-ignore
				const fileContent = e.currentTarget.result;
				this.subscriptionHandler.subscribeToMany(parseOpml(fileContent));
			}

			reader.readAsText(file);
		}
	}

	render() {
		return (
			<PageWithFooter>
			<IonHeader>
				<IonToolbar>
				<IonButtons slot="start">
					<IonMenuButton />
				</IonButtons>
				<IonTitle>Search Podcast</IonTitle>
				</IonToolbar>
			</IonHeader>
			

			<IonContent fullscreen>
				<IonHeader collapse="condense">
				<IonToolbar>
					<IonTitle size="large">Add Podcast</IonTitle>
				</IonToolbar>
				</IonHeader>
				<form onSubmit={e => this.handleSearchSubmit(e)}>
					<IonSearchbar value={this.state.searchText} debounce={0} onIonChange={e => this.setSearchText(e.detail.value!)}/>
				</form>
				<IonToolbar>
					<IonButtons>
						<IonButton onClick={(e) => this.handleClickImportOpml()}>Import OPML file</IonButton>
					</IonButtons>
				</IonToolbar>
				<input id="opmlUploader" type="file" style={{display: "none"}} accept=".opml, .xml" onChange={(e) => this.handleChangeOpmlUploader(e)}></input>
				<IonList>
					{this.state.podcastSearchResult.items.map((podcast) => (
						<IonItem>
							<IonThumbnail slot="start">
								<ImgWithFallBack src={podcast.imageUrl}/>
							</IonThumbnail>
							<IonLabel>
								<h2>{podcast.title}</h2>
								<p>{podcast.description}</p>
							</IonLabel>
							{podcast.subscribed ?
							<IonButton disabled={true}>Subscribed</IonButton> :
							<IonButton onClick={e => this.handleClickSubscribe(e, podcast)}>Subscribe</IonButton>
							}
						</IonItem>
					))}
				</IonList>
			</IonContent>
			</PageWithFooter>
		);
	}
}