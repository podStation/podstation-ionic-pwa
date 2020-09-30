import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton, IonText, IonTextarea } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';

const Home: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
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
      </IonContent>
    </IonPage>
  );
};

export default Home;
