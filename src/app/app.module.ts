import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GamePage } from '../pages/game/game';
import { PlayerService } from '../services/player-service';
import { PlayerPage } from '../pages/player/player';
import { GamesService } from '../services/games-service';
import { PaymentService } from '../services/payment-service';
import { HttpClientModule } from '@angular/common/http';
import { AddGamePage } from '../pages/add-game/add-game';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { PlayersPage } from '../pages/players/players';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GamePage,
    PlayerPage,
    AddGamePage,
    PlayersPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
  	AngularFirestoreModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GamePage,
    PlayerPage,
    AddGamePage,
    PlayersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PlayerService,
    GamesService,
    PaymentService,
    AngularFirestoreModule
  ]
})
export class AppModule {}
