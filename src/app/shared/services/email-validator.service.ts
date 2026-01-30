import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService {
  private emailsCadastrados = [
    'usuario1@exemplo.com',
    'usuario2@exmeplo.com',
    'teste@exemplo.com',
    'admin@exemplo.com',
    'contato@exemplo.com'
  ];

  verficarEmailExistente(email: string): Observable<boolean>{
    return of(this.emailsCadastrados.includes(email.toLowerCase())).pipe(delay(1500))
  }
}
