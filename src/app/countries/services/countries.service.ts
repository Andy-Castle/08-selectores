import { Injectable } from '@angular/core';
import {
  Country,
  Region,
  SmallCountry,
} from '../interfaces/country.interfaces';
import { map, Observable, of, tap } from 'rxjs';
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
      .get<Country[]>(url) // Realiza la petición a la API y espera un array de SmallCountry
      .pipe(
        map((countries) =>
          countries.map((country) => ({
            name: country.name.common,
            cca3: country.cca3,
            borders: country.borders ?? [],
          }))
        )
        // `tap` permite ejecutar efectos secundarios, en este caso, imprimir la respuesta en consola
        // tap((response) => console.log({ response }))
      );
  }

  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry> {
    // console.log({ alphaCode });

    const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;

    return this.http.get<Country>(url).pipe(
      map((country) => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? [],
      }))
    );
  }
}
