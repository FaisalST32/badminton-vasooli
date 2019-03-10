import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController, Spinner } from 'ionic-angular';
import { Game } from '../../models/game';
import { PaymentViewModel } from '../../viewModels/game.viewModel';
import { PaymentStatus } from '../../models/playerPayment';
import { PlayerService } from '../../services/player-service';
import { PlayerPage } from '../player/player';
import { PaymentService } from '../../services/payment-service';
import { GamesService } from '../../services/games-service';
import { Player } from '../../models/player';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

  public game: Game;
  public payments: PaymentViewModel[];
  players: Player[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private playerService: PlayerService,
              private actionCtrl: ActionSheetController,
              private paymentService: PaymentService,
              private loadingCtrl: LoadingController) {
    this.game = this.navParams.data;
    let loader = this.loadingCtrl.create({
      content: 'Loading',
      spinner: 'crescent'
    });
    loader.present();
    this.playerService.getPlayers()
      .subscribe(data => {

        this.players = data;
        console.log(data);
        this.updatePayments();
        loader.dismiss();

      })
  }

  onManagePayment(payment: PaymentViewModel){
    let actionSheet = this.actionCtrl.create({
      title: 'Manage Payment',
      buttons: [
        {
          text: 'Paid',
          handler: () => {
            this.onChangePayment(payment.playerId, PaymentStatus.Paid);
          },
          icon: 'cash'
        },
        {
          text: 'Request Sent',
          handler: () => {
            this.onChangePayment(payment.playerId, PaymentStatus.RequestSent);
          },
          icon: 'send'
        },
        {
          text: 'Not Paid',
          handler: () => {
            this.onChangePayment(payment.playerId, PaymentStatus.RequestNotSent);
          },
          icon: 'alert'
        },
        {
          text: 'View Player',
          handler: () => {
            this.onViewPlayer(payment.playerId);
          },
          icon: 'person'
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close-circle'
        }

      ]
    });
    actionSheet.present();

  }
  onChangePayment(playerId: string, status: number): any {
    console.log(this.game);
    this.game.payments.find(pm => pm.playerId == playerId).status = status;
    this.paymentService.changePaymentStatusForGame(this.game)
      .then(() => {
        console.log('Status Changed');
        this.updatePayments( );

      });

    console.log(this.game);
  }

  updatePayments(): any {
    this.payments = this.game.payments.map(payment => {
      return {playerId: payment.playerId, name: this.players.find(pl => pl.id == payment.playerId).name, status: this.getStatus(payment.status)}
    })
  }


  onViewPlayer(playerId: string){
    this.navCtrl.push(PlayerPage, {playerId: playerId});
  }

  getStatus(statusNumber: number): string{
    if(statusNumber == PaymentStatus.RequestNotSent)
      return 'Not-Sent';
    else if(statusNumber == PaymentStatus.RequestSent)
      return 'Sent';
    else if(statusNumber == PaymentStatus.Paid)
      return 'Paid';
  }

}
