import { Injectable } from "@angular/core";
import { Game } from "../models/game";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from 'rxjs/operators';


@Injectable()
export class GamesService{

  public games: Game[] = [];

  constructor(private db: AngularFirestore){}
  getGames(forceReload: boolean = false): Observable<Game[]>{
    console.log(this.games.length)
    if(this.games.length > 0 && !forceReload){
      return Observable.of(this.games);
    }
    else if(this.games.length == 0){
      return this.db.collection<Game>('games').snapshotChanges().pipe(map(data => {

        let gameArray = data.map(dm => {
          return {id: dm.payload.doc.id, date: dm.payload.doc.data().date, totalCourts: dm.payload.doc.data().totalCourts, payments: dm.payload.doc.data().payments}
        });
        this.games = gameArray;
        return gameArray;
      }));
    }
  }

  addGame(game: Game){
    let gameModel = {totalCourts: game.totalCourts, payments: game.payments, date: game.date};
    return this.db.collection('games').add(gameModel);
  }
}
