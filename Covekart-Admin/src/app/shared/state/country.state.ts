import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { of, tap } from "rxjs";
import { GetCountries } from "../action/country.action";
import { Country } from "../interface/country.interface";
import { CountryService } from "../services/country.service";

export class CountryStateModel {
  country = {
    data: [] as Country[]
  }
}

@State<CountryStateModel>({
  name: "country",
  defaults: {
    country: {
      data: []
    }
  },
})
@Injectable()
export class CountryState {

  constructor(private countryService: CountryService) { }

  @Selector()
  static country(state: CountryStateModel) {
    return state.country;
  }

  @Selector()
  static countries(state: CountryStateModel) {
    return state?.country?.data?.map(cn => {
      return { label: cn?.name, value: cn?.id }
    });
  }

  // @Action(GetCountries)
  // getCountries(ctx: StateContext<CountryStateModel>, action: GetCountries) {
  //   const state = ctx.getState();
  
  //   // Check if countries are already loaded in the state
  //   if (state?.country?.data?.length) {
      
  //   }
  
  //   // Fetch countries from the service
  //   return this.countryService.getCountries().pipe(
  //     tap({
  //       next: (result: Country[]) => { // Ensure proper typing of `result`
  //         ctx.patchState({
  //           country: {
  //             ...state.country, // Retain other properties if any
  //             data: result,
  //           },
  //         });
  //       },
  //       error: (err: any) => {
  //         console.error('Error fetching countries:', err); // Log error for debugging
  //         throw new Error(err?.error?.message || 'An error occurred while fetching countries.');
  //       },
  //     })
  //   );
  // }
  



  @Action(GetCountries)
getCountries(ctx: StateContext<CountryStateModel>, action: GetCountries) {
  const state = ctx.getState();
  if (state?.country?.data?.length) {
    return of(null); 
  }
  
  return this.countryService.getCountries().pipe(
    tap({
      next: (result: Country[]) => {
     
        ctx.patchState({
          country: {
            ...state.country, 
            data: result, 
          },
        });
      },
      error: (err: any) => {
        console.error('Error fetching countries:', err);  // Log error for debugging
        throw new Error(err?.error?.message || 'An error occurred while fetching countries.');
      },
    })
  );
}


 
}
