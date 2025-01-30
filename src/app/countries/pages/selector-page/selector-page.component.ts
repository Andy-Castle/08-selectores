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
  public borders: string[] = [];

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
      .get('country')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((value: string) => value.length > 0),
        switchMap((alphacode) =>
          this.countriesService.getCountryByAlphaCode(alphacode)
        )
      )
      .subscribe((country) => {
        // console.log({ borders: country.borders });
        this.borders = country.borders;
      });
  }
}
