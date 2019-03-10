import { Injectable } from "@angular/core";
import { Player } from "../models/player";
import { GamesService } from "./games-service";
import { PlayerPayment, PaymentStatus } from "../models/playerPayment";
import { map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";

@Injectable()
export class PlayerService {

  subject = new Subject();

  players: Player[];





  constructor(private gamesService: GamesService,
              private db: AngularFirestore) {

  }

  getPlayers(forceReload: boolean = false): Observable<Player[]>{
    if(!this.players || forceReload){
      return this.db.collection<Player>('users').snapshotChanges()
        .pipe(map((data) => {
          return data.map(pl => {
            return {name: pl.payload.doc.data().name, id: pl.payload.doc.id}
          })
        }));

    }
    else return Observable.of(this.players);
  }


  getPlayerNameFromId(id: string): Observable<string> {
    if(this.players)
      return Observable.of(this.players.find(player => player.id == id).name);
    else
    return this.getPlayers().pipe(map(data => {
      return data.find(player => player.id == id).name;
    }))
  }



    getPlayerOutstanding(id: string): Observable<number>{
    let games;
    return this.gamesService.getGames().pipe(map(data => {
      games = data;
      let paymentsArray = games.map(game => {return game.payments});
      let payments: PlayerPayment[] = [].concat(...paymentsArray);
      return payments.filter(payment => {return payment.playerId == id && payment.status != PaymentStatus.Paid})
          .map((item) => {
            return item.amount
          })
          .reduce((accumulator, item) => {
           return  Number(accumulator) + Number(item)
          }, 0);
    }))
  }



  addPlayer(playerName: string){
      return this.db.collection('users').add({
        name: playerName
      })
  }


}
