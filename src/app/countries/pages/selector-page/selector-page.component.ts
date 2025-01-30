import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  onRegionChanged(): void {
    // Escucha los cambios en el control del formulario llamado 'region'
    this.myForm
      .get('region')! // Obtiene el control 'region' del formulario
      .valueChanges // Detecta cambios en el valor del control
      .pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => (this.borders = [])),

        // Usa switchMap para cancelar peticiones anteriores si el usuario cambia la región rápidamente
        switchMap((region) =>
          this.countriesService.getCountriesByRegion(region)
        )
      )
      .subscribe((countries) => {
        // Cuando llegan los datos de los países, se imprimen en la consola
        // console.log(region);
        this.countriesByRegion = countries;
      });
  }

  onCountryChanged(): void {
    this.myForm
      .get('country')! // Obtenemos el control del formulario que representa el país seleccionado
      .valueChanges.pipe(
        // Cada vez que cambia el país seleccionado...

        tap(() => this.myForm.get('border')!.setValue('')), // Reiniciamos el valor del campo de fronteras

        filter((value: string) => value.length > 0), // Solo continuamos si se ha seleccionado un país

        switchMap((alphacode) =>
          // Buscamos la información del país seleccionado usando su código
          this.countriesService.getCountryByAlphaCode(alphacode)
        ),

        switchMap((country) =>
          // Cuando obtenemos el país, buscamos sus países fronterizos
          this.countriesService.getCountryBordersByCode(country.borders)
        )
      )
      .subscribe((countries) => {
        // Cuando las peticiones finalizan, actualizamos la lista de fronteras
        this.borders = countries;
      });
  }
}
