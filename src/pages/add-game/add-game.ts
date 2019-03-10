import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Player } from '../../models/player';
import { PlayerService } from '../../services/player-service';
import { Game } from '../../models/game';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { PlayerPayment, PaymentStatus } from '../../models/playerPayment';
import { GamesService } from '../../services/games-service';

@Component({
  selector: 'page-add-game',
  templateUrl: 'add-game.html',
})
export class AddGamePage {
  public players: Player[] = [];
  public allPlayers: Player[] = [];
  public game: Game;

  public gameForm: FormGroup;

  constructor(private playerService: PlayerService,
              private gameService: GamesService,
              private alertCtrl: AlertController,
              private nav: NavController) {
    let subscription = this.playerService.getPlayers()
      .subscribe(players => {
        this.players = players.slice();
        this.allPlayers = players.slice().slice();
        subscription.unsubscribe();
      });

    this.initializeForm();
  }

  onAddPlayer(player: Player) {
    this.players = this.players.filter(pl => player != pl);
    console.log(this.players.length);
    let paymentsArray = this.gameForm.get('payments') as FormArray;
    paymentsArray.push(new FormGroup({
      name: new FormControl(player.name),
      id: new FormControl(player.id),
      amount: new FormControl()
    }));
    console.log(paymentsArray);
  }

  onRemovePlayer(playerId: string, formArrayItemIndex: number) {
    this.players.push(this.allPlayers.find(pl => pl.id == playerId));
    let paymentsArray = this.gameForm.get('payments') as FormArray;
    paymentsArray.removeAt(formArrayItemIndex);
  }

  onSubmitForm() {
    let formData = this.gameForm.getRawValue();
    console.log(formData);
    let payments: PlayerPayment[] = formData.payments.map(pm => {
      return { playerId: pm.id, status: PaymentStatus.RequestNotSent, amount: Number(pm.amount) }
    })
    if (this.checkAmounts()) {
      let game: Game = {
        totalCourts: formData.courtsNumber,
        date: formData.date,
        payments: payments
      }
      this.gameService.addGame(game)
        .then(data => {
          let alert = this.alertCtrl.create({
            title: 'Game Saved',
            message: 'The Game has been saved successfully.',
            buttons: [{
              text: 'Okay',
              handler: () => {
                this.nav.pop();
              }
            }]
          });
          alert.present();
        });
    }
  }

  checkAmounts(): boolean {
    let paymentsArray = this.gameForm.get('payments') as FormArray;
    let paymentSum = paymentsArray.value
      .filter(pm => pm.amount)
      .map(pm => pm.amount)
      .reduce((total, number) => Number(total) + Number(number), 0);
    let arePaymentsMatchingTotalAmount: boolean = paymentSum == this.gameForm.get('totalAmount').value;
    let isAnyPaymentEmpty: boolean = paymentsArray.value.filter(pm => !pm.amount).length > 0;
    if (paymentsArray.length == 0) {
      let alert = this.alertCtrl.create({
        title: 'No players selected',
        message: 'Please select the players involved in the game.',
        buttons: [{
          text: 'ok',
          role: 'cancel'
        }]
      });
      alert.present();
      return false;
    }
    else if (isAnyPaymentEmpty || !arePaymentsMatchingTotalAmount) {
      this.promptAmountInvalid();
      return false;
    }
    return true;

  }
  promptAmountInvalid(): any {
    let alert = this.alertCtrl.create({
      title: 'Amount Mismatch',
      message: 'Amount entered doesn\'t match individual amounts sum. Autoset amounts?',
      buttons: [
        {
          text: 'Okay',
          handler: () => this.autosetAmounts()
        },
        {
          text: 'cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  autosetAmounts(): void {
    debugger;
    let paymentsArray = this.gameForm.get('payments') as FormArray;
    let emptyFieldsNumber = paymentsArray.getRawValue().filter(pm => !pm.amount).length;
    if(!emptyFieldsNumber){
      let averageAmount = (Number((this.gameForm.get('totalAmount').value) / paymentsArray.length).toFixed(1));
      for (var i = 0; i < paymentsArray.length; i++) {
          paymentsArray.get(i.toString()).get('amount').setValue(averageAmount);
      }
    }
    else{
      let amountEntered = paymentsArray.getRawValue().filter(pm => pm.amount).map(pm => Number(pm.amount)).reduce((total, entry) => total + entry, 0);
      let remainingAmount = Number(this.gameForm.get('totalAmount').value) - Number(amountEntered)
      let averageAmount = +(remainingAmount / emptyFieldsNumber).toFixed(1);
      for (var i = 0; i < paymentsArray.length; i++) {
        let enteredAmount = paymentsArray.get(i.toString()).get('amount').value;
        if(!enteredAmount)
          paymentsArray.get(i.toString()).get('amount').setValue(averageAmount);
      }
    }

  }

  onNewPlayer() {
    let alert = this.alertCtrl.create({
      title: 'Add New Player',
      inputs: [{
        type: 'text',
        name: 'newPlayer',
        placeholder: 'Player Name'
      }],
      buttons: [{
        text: 'Add',
        handler: (data) => {
          if (data.newPlayer == null || data.newPlayer.trim() == '') {
            return;
          }

          this.addNewPlayer(data.newPlayer);
        },
      },
      {
        text: 'cancel',
        role: 'cancel'
      }]
    });
    alert.present();
  }

  addNewPlayer(name: string): void {

    this.playerService.addPlayer(name).then(data => {
      this.players.push({id: data.id, name: name})
    })

  }

  initializeForm() {
    let date = new Date();
    let dateString = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    this.gameForm = new FormGroup({
      totalAmount: new FormControl('', Validators.required),
      courtsNumber: new FormControl('', Validators.required),
      date: new FormControl(dateString, Validators.required),
      payments: new FormArray([])
    })
  }



}
