import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';


//guard que verifica si el usuario esta auntentificado viendo si existe token, si no esta autenticado lo manda a la pantalla de login
//Debemos hacer notar que este es un servcio que devuelve observables y este Guard se implementa en app-routing-module.ts mediante
//canMatch o canActivate y si notamos en los procesos de este servicio no hay ningun Subscribe, pero este subscribe lo maneja angular
//al llamar a este guard en app-routing.module.ts cuando llama a los metodos canActive o canMatch
//aca solo estamos adicionanod mas tap es decir mas manejos secundarios
@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router,
    ) { }

  private checkAuthstatus(): boolean | Observable<boolean>{
    return this.authService.checkAuthentication()
      .pipe(
        tap(isAuthenticated => {
          if (!isAuthenticated){
            this.router.navigate(['./auth/login']);
          }
        })
      );
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean>  {

    //console.log('Can match');
    //console.log({route,segments})

    return this.checkAuthstatus();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean>  {

    //console.log('Can Activate');
    //console.log({route,state});
    return this.checkAuthstatus();
  }


}

