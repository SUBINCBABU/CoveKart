import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Select2Data } from 'ng-select2-component';
import { Observable, forkJoin } from 'rxjs';
import { GetCurrencies } from '../../shared/action/currency.action';
import { GetBackendSettingOption, UpdateSettingOption } from '../../shared/action/setting.action';
import { Attachment } from '../../shared/interface/attachment.interface';
import { CurrencyState } from '../../shared/state/currency.state';
import { SettingState } from '../../shared/state/setting.state';
import { DayInterval, Values } from '../../shared/interface/setting.interface';
import * as data from '../../shared/data/time-zone';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})

export class SettingComponent {
  
  @Select(CurrencyState.currencies) currency$: Observable<Select2Data>;
  @Select(SettingState.backEndSetting) setting$: Observable<Values>;
  
  public form: FormGroup;
  public active = 'general';
  public active_payment = 1;
  public time_zone = data.time_zone;
  public active_analytics = 'facebook';
  public mail_mailer: Select2Data = [
    {
      value: 'sendmail',
      label: 'Sendmail',
    },
    {
      value: 'smtp',
      label: 'SMTP',
    },
    {
      value: 'mailgun',
      label: 'Mailgun',
    },
  ];
  
  public encryption: Select2Data = [
    {
      value: 'ssl',
      label: 'SSL',
    },
    {
      value: 'tls',
      label: 'TLS',
    }
  ];

  public language_direction: Select2Data = [
    {
      value: 'ltr',
      label: 'LTR',
    },
    {
      value: 'rtl',
      label: 'RTL',
    }
  ];

  public mode: Select2Data = [
    {
      value: 'light-only',
      label: 'Light',
    },
    {
      value: 'dark-only',
      label: 'Dark',
    }
  ];

  constructor(private store: Store,
    private formBuilder: FormBuilder){
    this.form = formBuilder.group({
      general: new FormGroup({
        light_logo_image_id: new FormControl(),
        dark_logo_image_id: new FormControl(),
        tiny_logo_image_id: new FormControl(),
        favicon_image_id: new FormControl(),
        site_title: new FormControl('', Validators.required),
        site_tagline: new FormControl(),
        default_timezone: new FormControl('Asia/Kolkata', Validators.required),
        default_currency_id: new FormControl(19, Validators.required),
        admin_site_language_direction: new FormControl('ltr'),
        min_order_amount: new FormControl(0 ,Validators.required),
        min_order_free_shipping: new FormControl(0 ,Validators.required),
        product_sku_prefix: new FormControl(),
        mode: new FormControl('light-only', Validators.required),
        copyright: new FormControl('Copyright Text Here'),
      }),
      activation: new FormGroup({
        multivendor: new FormControl(true),
        point_enable: new FormControl(true),
        coupon_enable: new FormControl(true),
        wallet_enable: new FormControl(true),
        stock_product_hide: new FormControl(true),
        store_auto_approve: new FormControl(true),
        product_auto_approve: new FormControl(true)
      }),
      wallet_points: new FormGroup({
        signup_points: new FormControl(100),
        min_per_order_amount: new FormControl(100),
        point_currency_ratio: new FormControl(30),
        reward_per_order_amount: new FormControl('')
      }),
      email: new FormGroup({
        mail_host: new FormControl(),
        mail_port: new FormControl(465),
        mail_mailer: new FormControl('smtp'),
        mail_password: new FormControl(),
        mail_username: new FormControl(),
        mail_encryption: new FormControl('ssl'),
        mail_from_name: new FormControl(),
        mail_from_address: new FormControl(),
        mailgun_domain: new FormControl(),
        mailgun_secret: new FormControl(),
      }),
      vendor_commissions: new FormGroup({
        status: new FormControl(true),
        min_withdraw_amount: new FormControl(),
        default_commission_rate: new FormControl(),
        is_category_based_commission: new FormControl(true),
      }),
      refund: new FormGroup({
        status: new FormControl(true),
        refundable_days: new FormControl(),
      }),
      newsletter: new FormGroup({
        status: new FormControl(true),
        mailchip_api_key: new FormControl(),
        mailchip_list_id: new FormControl(),
      }),
      analytics: new FormGroup({
        facebook_pixel: new FormGroup({
          status: new FormControl(true),
          pixel_id: new FormControl(),
        }),
        google_analytics: new FormGroup({
          status: new FormControl(true),
          measurement_id: new FormControl(),
        })
      }),
      delivery: new FormGroup({
        default_delivery: new FormControl(true),
        default: new FormGroup({
          title: new FormControl(),
          description: new FormControl()
        }),
        same_day_delivery: new FormControl(true),
        same_day: new FormGroup({
          title: new FormControl(),
          description: new FormControl()
        }),
        same_day_intervals: new FormArray([])
      }),
      google_reCaptcha: new FormGroup({
        status: new FormControl(true),
        secret: new FormControl(),
        site_key: new FormControl(),
      }),
      payment_methods: new FormGroup({
        paypal: new FormGroup({
          status: new FormControl(true),
          client_id: new FormControl(),
          client_secret: new FormControl(),
          sandbox_mode: new FormControl(true),
        }),
        stripe: new FormGroup({
          key: new FormControl(),
          secret: new FormControl(),
          status: new FormControl(true),
        }),
        razorpay: new FormGroup({
          key: new FormControl(),
          secret: new FormControl(),
          status: new FormControl(true),
        }),
        mollie: new FormGroup({
          status: new FormControl(true),
          secret_key: new FormControl(),
        }),
        cod: new FormGroup({
          status: new FormControl(true),
        }),
      }),
      maintenance: new FormGroup({
        title: new FormControl(),
        maintenance_mode: new FormControl(false),
        maintenance_image_id: new FormControl(),
        description: new FormControl(),
      })
    });
  }

  get sameDayIntervals(): FormArray {
    return (<any>this.form.controls['delivery']).controls['same_day_intervals']
  }

  ngOnInit() {
    const backendSettingOption$ = this.store.dispatch(new GetBackendSettingOption());
    const getCurrencies$ = this.store.dispatch(new GetCurrencies({ status: 1 }));

    forkJoin([backendSettingOption$, getCurrencies$]).subscribe({
      complete: () => { 
        this.patchForm();
      }     
    });
  }

  patchForm() {
    this.store.select(SettingState.backEndSetting).subscribe(option => {
      this.form.patchValue({
        general: {
          light_logo_image_id: option?.general?.light_logo_image_id,
          dark_logo_image_id: option?.general?.dark_logo_image_id,
          favicon_image_id: option?.general?.favicon_image_id,
          tiny_logo_image_id: option?.general?.tiny_logo_image_id,
          site_title: option?.general?.site_title,
          site_tagline: option?.general?.site_tagline,
          default_timezone: option?.general?.default_timezone,
          default_currency_id: +option?.general?.default_currency_id!,
          admin_site_language_direction: option?.general?.admin_site_language_direction,
          min_order_amount: option?.general?.min_order_amount,
          min_order_free_shipping: option?.general?.min_order_free_shipping,
          product_sku_prefix: option?.general?.product_sku_prefix,
          mode: option?.general?.mode, 
          copyright: option?.general?.copyright
        },
        activation: {
          multivendor: option?.activation?.multivendor,
          point_enable: option?.activation?.point_enable,
          coupon_enable: option?.activation?.coupon_enable,
          wallet_enable: option?.activation?.wallet_enable,
          stock_product_hide: option?.activation?.stock_product_hide,
          store_auto_approve: option?.activation?.store_auto_approve,
          product_auto_approve: option?.activation?.product_auto_approve,
        },
        wallet_points: {
          signup_points: option?.wallet_points?.signup_points,
          min_per_order_amount: option?.wallet_points?.min_per_order_amount,
          point_currency_ratio: option?.wallet_points?.point_currency_ratio,
          reward_per_order_amount: option?.wallet_points?.reward_per_order_amount,
        },
        email: {
          mail_host: option?.email?.mail_host,
          mail_port: option?.email?.mail_port,
          mail_mailer: option?.email?.mail_mailer,
          mail_password: option?.email?.mail_password,
          mail_username: option?.email?.mail_username,
          mail_encryption: option?.email?.mail_encryption,
          mail_from_name: option?.email?.mail_from_name,
          mail_from_address: option?.email?.mail_from_address,
          mailgun_domain: option?.email?.mailgun_domain,
          mailgun_secret: option?.email?.mailgun_secret,
        },
        vendor_commissions: {
          status: option?.vendor_commissions?.status,
          min_withdraw_amount: option?.vendor_commissions?.min_withdraw_amount,
          default_commission_rate: option?.vendor_commissions?.default_commission_rate,
          is_category_based_commission: option?.vendor_commissions?.is_category_based_commission,
        },
        refund: {
          status: option?.refund?.status,
          refundable_days: option?.refund?.refundable_days,
        },
        newsletter: {
          mailchip_api_key: option?.newsletter?.mailchip_api_key,
          mailchip_list_id: option?.newsletter?.mailchip_list_id,
        },
        analytics: {
          facebook_pixel: {
            status: option?.analytics?.facebook_pixel?.status,
            pixel_id: option?.analytics?.facebook_pixel?.pixel_id,
          },
          google_analytics:{
            status: option?.analytics?.google_analytics?.status,
            measurement_id: option?.analytics?.google_analytics?.measurement_id,
          }
        },
        delivery: {
          default_delivery: 1,
          default: {
            title: option?.delivery?.default?.title,
            description: option?.delivery?.default?.description
          },
          same_day_delivery: option?.delivery?.same_day_delivery,
          same_day: {
            title: option?.delivery?.same_day?.title,
            description: option?.delivery?.same_day?.description
          }
        },
        google_reCaptcha: {
          secret:  option?.google_reCaptcha?.secret,
          status: option?.google_reCaptcha?.status,
          site_key: option?.google_reCaptcha?.site_key,
        },
        payment_methods: {
          paypal: {
            status: option?.payment_methods?.paypal?.status,
            client_id: option?.payment_methods?.paypal?.client_id,
            client_secret: option?.payment_methods?.paypal?.client_secret,
            sandbox_mode: option?.payment_methods?.paypal?.sandbox_mode,
          },
          stripe: {
            key: option?.payment_methods?.stripe?.key,
            secret: option?.payment_methods?.stripe?.secret,
            status: option?.payment_methods?.stripe?.status,
          },
          razorpay: {
            key: option?.payment_methods?.razorpay?.key,
            secret: option?.payment_methods?.razorpay?.secret,
            status: option?.payment_methods?.razorpay?.status,
          },
          mollie: {
            status: option?.payment_methods?.mollie?.status, 
            secret_key: option?.payment_methods?.mollie?.secret_key, 
          },
          cod: {
            status: option?.payment_methods?.cod?.status
          }
        },
        maintenance: {
          title: option?.maintenance?.title,
          maintenance_mode: option?.maintenance?.maintenance_mode,
          maintenance_image_id: option?.maintenance?.maintenance_image_id,
          description: option?.maintenance?.description
        }
      });
      this.sameDayIntervals.clear();
      option?.delivery?.same_day_intervals?.forEach((delivery: DayInterval) => 
        this.sameDayIntervals.push(
          this.formBuilder.group({
            title: new FormControl(delivery?.title),
            description: new FormControl(delivery?.description)
          })
      ));
    });
  }


  getFieldClass(control: any): string {
    return control.invalid ? 'is-invalid' : '';
  }

  
  selectLightLogo(data: Attachment) {
    if(!Array.isArray(data)) {
      (<FormGroup>this.form.controls['general']).controls['light_logo_image_id'].setValue(data ? data?.id : null);
    }
  }

  selectDarkLogo(data: Attachment) {
    if(!Array.isArray(data)) {
      (<FormGroup>this.form.controls['general']).controls['dark_logo_image_id'].setValue(data ? data?.id : null);
    }
  }

  selectTinyLogo(data: Attachment) {
    if(!Array.isArray(data)) {
      (<FormGroup>this.form.controls['general']).controls['tiny_logo_image_id'].setValue(data ? data?.id : null);
    }
  }

  selectFavicon(data: Attachment) {
    if(!Array.isArray(data)) {
      (<FormGroup>this.form.controls['general']).controls['favicon_image_id'].setValue(data ? data?.id : null);
    }
  }

  selectMaintenance(data: Attachment) {
    if(!Array.isArray(data)) {
      (<FormGroup>this.form.controls['maintenance']).controls['maintenance_image_id'].setValue(data ? data?.id : null);
    }
  }

  addDays(event: Event) {
    event.preventDefault();
    this.sameDayIntervals.push(
      this.formBuilder.group({
        title: new FormControl(),
        description: new FormControl()
      })
    );
  }

  remove(index: number) {
    if(this.sameDayIntervals.length <= 1) return
      this.sameDayIntervals.removeAt(index);
  }

  submit() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      this.store.dispatch(new UpdateSettingOption({values: this.form.value}));
    }
  }

}
