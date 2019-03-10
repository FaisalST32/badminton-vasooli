import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Game } from '../../models/game';
import { GamePage } from '../game/game';
import { GamesService } from '../../services/games-service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public games: Game[];
  public emptyText: string = '';

  constructor(public navCtrl: NavController,
              private gamesService: GamesService,
              private loadingCtrl: LoadingController) {
    let loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Getting Games',
      showBackdrop: true
    });
    loader.present();
    this.gamesService.getGames().subscribe(games => {
      this.games = games;
      if(this.games.length == 0){
        this.emptyText = 'No Games Found';
      }
      loader.dismiss();
    });
  }

  goToGame(game: Game){
    this.navCtrl.push(GamePage, game);
  }

}
