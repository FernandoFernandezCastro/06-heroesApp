import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
//guard que verifica si el usuario esta autentificado y va a la pagina del login directo entonces se direccione automaticamnete a la lista de heroes

//Debemos hacer notar que este es un servcio que devuelve observables y este Guard se implementa en app-routing-module.ts mediante
//canMatch o canActivate y si notamos en los procesos de este servicio no hay ningun Subscribe, pero este subscribe lo maneja angular
//al llamar a este guard en app-routing.module.ts cuando llama a los metodos canActive o canMatch
//aca solo estamos adicionanod mas tap es decir mas manejos secundarios
@Injectable({providedIn: 'root'})
export class PublicGuard implements CanActivate, CanMatch{
  constructor(
    private authService: AuthService,
    private router: Router,
    ) { }

  private checkAuthstatus(): boolean | Observable<boolean>{
    return this.authService.checkAuthentication()
      .pipe(
        tap(isAuthenticated => {
          if (isAuthenticated){
            this.router.navigate(['./']);
          }
        }),
        map( isAuthenticated => !isAuthenticated)
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
