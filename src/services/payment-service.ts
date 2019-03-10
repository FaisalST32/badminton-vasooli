import { Injectable } from "@angular/core";
import { GamesService } from "./games-service";
import { Game } from "../models/game";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable()
export class PaymentService{

  constructor(private gamesService: GamesService,
              private db: AngularFirestore) {}

  changePaymentStatusGlobally(status: number, playerId: string){
    for(var i = 0; i < this.gamesService.games.length; i++){
      this.gamesService.games[i].payments.find(payment => payment.playerId == playerId)
        .status = status;
    }

  }

  changePaymentStatusForGame(game: Game){
    return this.db.collection('games').doc(game.id).set(
      {date: game.date, totalCourts: game.totalCourts, payments: game.payments}
    )



  }
}
