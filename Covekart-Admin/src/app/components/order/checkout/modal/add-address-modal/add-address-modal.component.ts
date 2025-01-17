import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { Select2Data, Select2UpdateEvent } from 'ng-select2-component';
import { CreateUserAddress } from '../../../../../shared/action/user.action';
import { SelectUser } from '../../../../../shared/action/order.action';
import { CountryState } from '../../../../../shared/state/country.state';
import { StateState } from '../../../../../shared/state/state.state';
import * as data from '../../../../../shared/data/country-code';

@Component({
  selector: 'app-address-modal',
  templateUrl: './add-address-modal.component.html',
  styleUrls: ['./add-address-modal.component.scss']
})
export class AddAddressModalComponent {
  
  public form: FormGroup;
  public closeResult: string;
  public modalOpen: boolean = false;
  public states$: Observable<Select2Data>;

  public codes = data.countryCodes;

  @ViewChild("addAddressModal", { static: false }) AddAddressModal: TemplateRef<string>;
  @Select(CountryState.countries) countries$: Observable<Select2Data>;
  
  @Input() id: number;
  
  constructor(private modalService: NgbModal,
    private store: Store,
    private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      user_id: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),   
      type: new FormControl('shipping',[Validators.required]),
      state_id: new FormControl('', [Validators.required]),
      country_id: new FormControl('', [Validators.required]),   
      city: new FormControl('', [Validators.required]),   
      pincode: new FormControl('', [Validators.required]),  
      country_code: new FormControl('91', [Validators.required]),  
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)])
    })
  }

  ngOnChanges() {}
  
  countryChange(data: Select2UpdateEvent) {
    if(data && data?.value) {
      this.states$ = this.store
          .select(StateState.states)
          .pipe(map(filterFn => filterFn(+data?.value)));
      this.form.controls['state_id'].setValue('');
    }
  }

  async openModal(value?: string) {
    this.form.controls['type'].setValue(value);
    this.modalOpen = true;
    this.modalService.open(this.AddAddressModal, {
      ariaLabelledBy: 'address-add-Modal',
      centered: true,
      windowClass: 'theme-modal modal-lg'
    }).result.then((result) => {
      `Result ${result}`
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  submit(id: number){
    this.form.markAllAsTouched();
    this.form.controls['user_id'].setValue(id);
    if(this.form.valid) {
      this.store.dispatch(new CreateUserAddress(this.form.value)).subscribe({
        complete: () => {
          this.store.dispatch(new SelectUser(id));
        }
      })
    }
  }

  ngOnDestroy() {
    if(this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
  
}
