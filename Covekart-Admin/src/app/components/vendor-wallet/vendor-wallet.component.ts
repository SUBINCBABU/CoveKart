import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Select2Data } from 'ng-select2-component';
import { Values } from '../../shared/interface/setting.interface';
import { ConfirmationModalComponent } from "../../shared/components/ui/modal/confirmation-modal/confirmation-modal.component";
import { Params } from "../../shared/interface/core.interface";
import { GetUsers } from '../../shared/action/user.action';
import { CreditVendorWallet, DebitVendorWallet, GetVendorTransaction } from '../../shared/action/vendor-wallet.action';
import { TableConfig } from '../../shared/interface/table.interface';
import { SettingState } from '../../shared/state/setting.state';
import { UserState } from '../../shared/state/user.state';
import { VendorWalletState } from '../../shared/state/vendor-wallet.state';
import { TransactionsData, VenderWallet } from '../../shared/interface/vendor-wallet.interface';
import { AccountState } from '../../shared/state/account.state';

@Component({
  selector: 'app-vendor-wallet',
  templateUrl: './vendor-wallet.component.html',
  styleUrls: ['./vendor-wallet.component.scss']
})
export class VendorWalletComponent {

  @Select(UserState.users) users$: Observable<Select2Data>;
  @Select(SettingState.setting) setting$: Observable<Values>;
  @Select(VendorWalletState.vendorWallet) vendorWallet$: Observable<VenderWallet>;
  @Select(AccountState.getRoleName) roleName$: Observable<string>;

  @ViewChild("confirmationModal") ConfirmationModal: ConfirmationModalComponent;
 
  public form: FormGroup;
  public balance: number = 0.00;
  public paginateInitialData: Params;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "amount", dataField: "amount", type: "price" },
      { title: "type", dataField: "type_status" },
      { title: "remark", dataField: "detail" },
      { title: "created_at", dataField: "created_at", type: "date" },
    ],
    data: [] as TransactionsData[],
    total: 0
  };

  constructor(@Inject(DOCUMENT) private document: Document,
  private renderer: Renderer2, private store: Store,
    private formBuilder: FormBuilder) {
    if(this.store.selectSnapshot(state => state.account.roleName !== 'vendor')){
      this.store.dispatch(new GetUsers({ role: 'vendor', status: 1 }));
    }
    this.form = this.formBuilder.group({
      vendor_id: new FormControl('', [Validators.required]),
      balance: new FormControl('', [Validators.required]),
    });

    if(this.store.selectSnapshot(state => state.account.roleName !== 'vendor')){
      this.form.controls['vendor_id'].valueChanges.subscribe(value => {
        if(value) {
          this.paginateInitialData['vendor_id'] = value;
          this.store.dispatch(new GetVendorTransaction(this.paginateInitialData));
          this.transactions();
        }
      })
    } else {
      this.store.dispatch(new GetVendorTransaction());
      this.transactions();
    }
  }

  transactions() {
    this.vendorWallet$.subscribe(wallet => { 
      let transactions = wallet?.transactions?.data?.filter((element: TransactionsData) => {
        element.type_status = element.type ? `<div class="status-${element.type}"><span>${element.type.replace(/_/g, " ")}</span></div>` : '-';
        return element;
      });
      this.balance = wallet ? wallet?.balance : 0;
      this.tableConfig.data = wallet ? transactions : [];
      this.tableConfig.total = wallet ? wallet?.transactions?.total : 0;
    });
    this.renderer.addClass(this.document.body, 'loader-none');
  }

  onTableChange(data?: Params) {
    this.paginateInitialData = data!;
    let vendor_id = this.form.controls['vendor_id']?.value;
    this.paginateInitialData['vendor_id'] = vendor_id;
    if(vendor_id) {
      this.store.dispatch(new GetVendorTransaction(this.paginateInitialData));
    }
  }

  submit(type: string) {
    this.form.markAllAsTouched();
    let action = new CreditVendorWallet(this.form.value);

    if(type == 'debit') {
      action = new DebitVendorWallet(this.form.value)
    }
    
    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { 
          this.form.controls['balance'].reset();
        }
      });
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'loader-none');
  }
 
}
