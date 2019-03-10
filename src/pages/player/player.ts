import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PlayerService } from '../../services/player-service';

@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {
  public playerId: string;
  public playerName: string;
  public playerOutstanding: number;
  constructor(public navParams: NavParams,
              public playerService: PlayerService) {
    this.playerId = this.navParams.get('playerId');
    this.playerService.getPlayerNameFromId(this.playerId)
                .subscribe(data => this.playerName = data);
    this.playerService.getPlayerOutstanding(this.playerId)
                .subscribe((data) => this.playerOutstanding = data);
  }




}
