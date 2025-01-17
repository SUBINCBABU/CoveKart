import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Select2Data } from 'ng-select2-component';
import { ConfirmationModalComponent } from "../../shared/components/ui/modal/confirmation-modal/confirmation-modal.component";
import { Params } from "../../shared/interface/core.interface";
import { TableConfig } from "../../shared/interface/table.interface";
import { Setting } from '../../shared/interface/setting.interface';
import { SettingState } from '../../shared/state/setting.state';
import { UserState } from '../../shared/state/user.state';
import { TransactionsData, Wallet } from "../../shared/interface/wallet.interface";
import { GetUsers } from '../../shared/action/user.action';
import { GetUserTransaction, CreditWallet, DebitWallet } from '../../shared/action/wallet.action';
import { WalletState } from '../../shared/state/wallet.state';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent {

  @Select(UserState.users) users$: Observable<Select2Data>;
  @Select(WalletState.wallet) wallet$: Observable<Wallet>;
  @Select(SettingState.setting) setting$: Observable<Setting>;

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
    this.store.dispatch(new GetUsers({ role: "consumer", status: 1 }));
    this.form = this.formBuilder.group({
      consumer_id: new FormControl('', [Validators.required]),
      balance: new FormControl('', [Validators.required]),
    });

    this.form.controls['consumer_id'].valueChanges.subscribe(value => {
      if(value) {
        this.paginateInitialData['consumer_id']  = value;
        this.store.dispatch(new GetUserTransaction(this.paginateInitialData));
        this.wallet$.subscribe(wallet => { 
          let transactions = wallet?.transactions?.data?.filter((element: TransactionsData) => {
            element.type_status = element.type ? `<div class="status-${element.type}"><span>${element.type.replace(/_/g, " ")}</span></div>` : '-';
            return element;
          });
          this.balance = wallet ? wallet?.balance : 0;
          this.tableConfig.data = wallet ? transactions : [];
          this.tableConfig.total = wallet ? wallet?.transactions?.total : 0;
        });
        this.renderer.addClass(this.document.body, 'loader-none');
      } else {
        this.balance = 0;
        this.tableConfig.data = [];
        this.tableConfig.total = 0;
        this.form.controls['balance'].reset();
      }
    });
  }

  onTableChange(data?: Params) {
    this.paginateInitialData = data!;
    let vendor_id = this.form.controls['consumer_id']?.value;
    this.paginateInitialData['consumer_id'] = vendor_id;
    if(vendor_id) {
      this.store.dispatch(new GetUserTransaction(data));
    }
  }

  submit(type: string) {
    this.form.markAllAsTouched();
    let action = new CreditWallet(this.form.value);

    if(type == 'debit') {
      action = new DebitWallet(this.form.value)
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
