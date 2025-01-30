import { Injectable } from '@angular/core';
import {
  Country,
  Region,
  SmallCountry,
} from '../interfaces/country.interfaces';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  constructor(private http: HttpClient) {}

  private baseUrl: string = 'https://restcountries.com/v3.1';

  private _regions: Region[] = [
    Region.Africa,
    Region.America,
    Region.Asia,
    Region.Europe,
    Region.Oceania,
  ];

  get regions(): Region[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    // Si no se proporciona una región, devuelve un Observable con un arreglo vacío
    if (!region) return of([]);

    // Construye la URL de la API para obtener los países de una región específica
    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    // Hace la petición HTTP GET y devuelve un Observable con los países
    return this.http
      .get<SmallCountry[]>(url) // Realiza la petición a la API y espera un array de SmallCountry
      .pipe(
        // `tap` permite ejecutar efectos secundarios, en este caso, imprimir la respuesta en consola
        tap((response) => console.log({ response }))
      );
  }
}
