import { Component } from '@angular/core';
import { PlayerService } from '../../services/player-service';
import { Player } from '../../models/player';
import { PlayersViewModel } from '../../viewModels/players.viewModel';
import { NavController } from 'ionic-angular';
import { PlayerPage } from '../player/player';

@Component({
  selector: 'page-players',
  templateUrl: 'players.html',
})
export class PlayersPage {

  public players: Player[] = [];
  public playerPayments: PlayersViewModel[] = [];
  public totalOutstanding: number = 0;

  constructor(private playersService: PlayerService,
              private nav: NavController) {

    this.playersService.getPlayers().subscribe(data => {
      this.players = data;
      this.loadPlayerOutstanding();
    });


  }

  loadPlayerOutstanding(){
    this.players.forEach(player => {
      this.playersService.getPlayerOutstanding(player.id).subscribe(amount => {
        this.playerPayments.push({id: player.id, name: player.name, pendingAmount: amount});
        this.totalOutstanding += amount;
      })
    })
  }

  onClickPlayer(playerId){
    this.nav.push(PlayerPage, {playerId: playerId});
  }





}
