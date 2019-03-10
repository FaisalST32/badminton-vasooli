import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AddGamePage } from '../pages/add-game/add-game';
import { PlayersPage } from '../pages/players/players';

@Component({
  templateUrl: 'app.html'
})
export class MyApp{
  rootPage: any = HomePage;




  @ViewChild(Nav) nav: Nav;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goToHome() {
    this.nav.popToRoot();
  }

  goToAddGame() {
    this.nav.push(AddGamePage);
  }

  goToPlayers(){
    this.nav.push(PlayersPage);
  }
}

