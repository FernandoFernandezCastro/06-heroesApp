import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?:User;
  constructor(private http: HttpClient) { }

  get currentUser():User|undefined{
    if (!this.user) return undefined;
    return structuredClone( this.user );//return {...this.user}; //el operador ... crea una copia pero inmutable para los que lo usen y se usa siempre y cuando no hay muchos objetos anidados
    //en cambio structuredClone crea una clonacion profunda del objeto
    /* La copia que se crea con el operador de propagación (...) y si modificas la copia no puedes modificar directamente el objeto original
    utilizando esa copia. Sin embargo, si el objeto original contiene referencias a otros objetos (como objetos anidados), las propiedades
    de esos objetos anidados aún pueden ser modificadas si esos objetos.*/
  }

  login( email: string, password: string): Observable<User>{

    // htto.post('login',{ email, password })
    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( user => {
          this.user = user;
        }),
        tap (user => localStorage.setItem('token', 'ASdfsdfd.fdsfsdfdaf.v78d78' ))
      );
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }

  checkAuthentication(): Observable<boolean> {
    if ( !localStorage.getItem('token') ) return of(false);

    const token = localStorage.getItem('token');

    return  this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( user => this.user = user ),
        map( user => !!user), // si el usuario existe con !user devuleve false y con la doble negacion !!user devolvemos true
        catchError(err => of(false))
      );


  }

}
