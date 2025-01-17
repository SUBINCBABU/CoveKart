import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, debounceTime } from 'rxjs';
import { Select2, Select2Data, Select2SearchEvent, Select2UpdateEvent } from 'ng-select2-component';
import { LoaderState } from '../../../shared/state/loader.state';
import { CartState } from '../../../shared/state/cart.state';
import { GetCartItems } from '../../../shared/action/cart.action';
import { OrderState } from '../../../shared/state/order.state';
import { SelectUser, Checkout, PlaceOrder, Clear } from '../../../shared/action/order.action';
import { AddAddressModalComponent } from './modal/add-address-modal/add-address-modal.component';
import { AddCustomerModalComponent } from './modal/add-customer-modal/add-customer-modal.component';
import { CouponModalComponent } from './modal/coupon-modal/coupon-modal.component';
import { UserState } from '../../../shared/state/user.state';
import { GetUsers } from '../../../shared/action/user.action';
import { Cart } from '../../../shared/interface/cart.interface';
import { SettingState } from '../../../shared/state/setting.state';
import { GetBackendSettingOption } from '../../../shared/action/setting.action';
import { OrderCheckout } from '../../../shared/interface/order.interface';
import { Values, DeliveryBlock } from '../../../shared/interface/setting.interface';
import { User } from '../../../shared/interface/user.interface';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  @Select(LoaderState.status) loadingStatus$: Observable<boolean>;
  @Select(UserState.users) users$: Observable<Select2Data>;
  @Select(CartState.cartItems) cartItem$: Observable<Cart[]>;
  @Select(OrderState.checkout) checkout$: Observable<OrderCheckout>;
  @Select(OrderState.selectedUser) selectedUser$: Observable<User>;
  @Select(SettingState.setting) setting$: Observable<Values>;

  @ViewChild("addAddressModal") AddAddressModal: AddAddressModalComponent;
  @ViewChild("addCustomerModal") AddCustomerModal: AddCustomerModalComponent;
  @ViewChild("couponModal") CouponModal: CouponModalComponent;

  @ViewChild('cpn', { static: false }) cpnRef: ElementRef<HTMLInputElement>;

  public form: FormGroup;
  public coupon: boolean = true;
  public couponCode: string;
  public appliedCoupon: boolean = false;
  public couponError: string | null;
  public checkoutTotal: OrderCheckout | null = null;
  public loading: boolean = false;
  private search = new Subject<string>();

  constructor(private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private store: Store,
    private formBuilder: FormBuilder) {
    this.store.dispatch(new GetUsers({ role: 'consumer', status: 1, paginate: 15 }));
    this.store.dispatch(new GetCartItems());
    this.store.dispatch(new GetBackendSettingOption());

    this.form = this.formBuilder.group({
      consumer_id: new FormControl('', [Validators.required]),
      products: this.formBuilder.array([], [Validators.required]),
      shipping_address_id: new FormControl('', [Validators.required]),
      billing_address_id: new FormControl('', [Validators.required]),
      points_amount: new FormControl(),
      wallet_balance: new FormControl(),
      coupon: new FormControl(),
      delivery_description: new FormControl('', [Validators.required]),
      delivery_interval: new FormControl(),
      payment_method: new FormControl('', [Validators.required])
    });

    this.form.valueChanges.subscribe(form => {
      this.checkout();
    });
  }

  get productControl(): FormArray {
    return this.form.get("products") as FormArray;
  }

  ngOnInit() {
    this.checkout$.subscribe(data => this.checkoutTotal = data);
    this.cartItem$.subscribe(items => {
      if(!items?.length) {
        this.router.navigateByUrl('/order/create');
      }
      this.productControl.clear();
      items!.forEach((item: Cart) => 
        this.productControl.push(
          this.formBuilder.group({
            product_id: new FormControl(item?.product_id, [Validators.required]),
            variation_id: new FormControl(item?.variation_id ? item?.variation_id : ''),
            quantity: new FormControl(item?.quantity),
          })
      ));
    });

    this.search
      .pipe(debounceTime(300)) // Adjust the debounce time as needed (in milliseconds)
      .subscribe((inputValue) => {
        this.store.dispatch(new GetUsers({ role: 'consumer', status: 1, paginate: 15, search: inputValue }));
        this.renderer.addClass(this.document.body, 'loader-none');
    });
  }
  
  selectUser(data: Select2UpdateEvent) {
    if(data?.value) {
      this.form.controls['shipping_address_id'].reset();
      this.form.controls['billing_address_id'].reset();
      this.form.controls['points_amount'].reset();
      this.form.controls['wallet_balance'].reset();
      this.form.controls['coupon'].reset();
      this.store.dispatch(new SelectUser(Number(data?.value)));
    }
  }

  userDropdown(event: Select2){
    if(event['innerSearchText']){
      this.search.next('');
    }
  }
  
  searchUser(event: Select2SearchEvent){
    this.search.next(event.search);
  }

  selectShippingAddress(id: number) {
    if(id) {
      this.form.controls['shipping_address_id'].setValue(Number(id));
    }
  }

  selectBillingAddress(id: number) {
    if(id) {
      this.form.controls['billing_address_id'].setValue(Number(id));
    }
  }

  selectDelivery(value: DeliveryBlock) {
    this.form.controls['delivery_description'].setValue(value?.delivery_description);
    this.form.controls['delivery_interval'].setValue(value?.delivery_interval);
  }

  selectPaymentMethod(value: string) {
    this.form.controls['payment_method'].setValue(value);
  }

  showCoupon() {
    this.coupon = true;
  }

  setCoupon(value?: string) {
    this.couponError = null;
    if(value)
      this.form.controls['coupon'].setValue(value);
    else 
      this.form.controls['coupon'].reset();
    this.store.dispatch(new Checkout(this.form.value)).subscribe({
      error: (err) => {
        this.couponError = err.message;
      },
      complete: () => { 
        this.appliedCoupon = value ? true : false;
        this.couponError = null;

        // Add modal
      }     
    });
  }

  couponRemove() {
    this.setCoupon();
  }

  checkout() {
    if(this.form.valid) {
      this.loading = true;
      this.store.dispatch(new Checkout(this.form.value)).subscribe({
        error: () => { 
          this.loading = false;
        },
        complete: () => { 
          this.loading = false;
        }   
      });
    }
  }

  placeorder() {
    if(this.form.valid) {
      if(!this.cpnRef.nativeElement.value) {
        this.form.controls['coupon'].reset();
      }
      this.store.dispatch(new PlaceOrder(this.form.value));
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new Clear());
    this.form.reset();
    this.search.next('');
    this.search.complete();
  }
}
