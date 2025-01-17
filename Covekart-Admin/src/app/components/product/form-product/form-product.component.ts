import { Component, Inject, Input, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject, of } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Editor } from 'ngx-editor';
import { map, switchMap, mergeMap, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { Select2, Select2Data, Select2SearchEvent, Select2UpdateEvent } from 'ng-select2-component';
import { priceValidator } from '../../../shared/validator/price-validator';
import { Product, Variation, Variant, VariationCombination } from '../../../shared/interface/product.interface';
import { ProductState } from '../../../shared/state/product.state';
import { GetProducts, CreateProduct, EditProduct, UpdateProduct } from '../../../shared/action/product.action';
import { StoreState } from '../../../shared/state/store.state';
import { GetStores } from '../../../shared/action/store.action';
import { GetAttributes, GetAttributeValues } from '../../../shared/action/attribute.action';
import { AttributeState } from '../../../shared/state/attribute.state';
import { CategoryModel } from '../../../shared/interface/category.interface';
import { CategoryState } from '../../../shared/state/category.state';
import { GetCategories } from '../../../shared/action/category.action';
import { TagModel } from '../../../shared/interface/tag.interface';
import { TagState } from '../../../shared/state/tag.state';
import { GetTags } from '../../../shared/action/tag.action';
import { TaxState } from '../../../shared/state/tax.state';
import { GetTaxes } from '../../../shared/action/tax.action';
import { Attachment } from '../../../shared/interface/attachment.interface';
import { Values } from '../../../shared/interface/setting.interface';
import { SettingState } from '../../../shared/state/setting.state';
import { Params } from '../../../shared/interface/core.interface';

function convertToNgbDate(date: NgbDateStruct): NgbDate {
  return new NgbDate(date.year, date.month, date.day);
}

@Component({
  selector: 'app-form-product',
  templateUrl:'./form-product.component.html',
  styleUrls: ['./form-product.component.scss']
})
export class FormProductComponent {

  @Input() type: string;

  @ViewChild('nav') nav: NgbNav;

  @Select(ProductState.selectedProduct) product$: Observable<Product>;
  @Select(ProductState.products) products$: Observable<Select2Data>;
  @Select(StoreState.stores) store$: Observable<Select2Data>;
  @Select(CategoryState.category) category$: Observable<CategoryModel>;
  @Select(TagState.tag) tag$: Observable<TagModel>;
  @Select(TaxState.taxes) tax$: Observable<Select2Data>;
  @Select(SettingState.setting) setting$: Observable<Values>;

  public attribute$: Observable<Select2Data>;
  public active = 'general';
  public tabError: string | null;
  public form: FormGroup;
  public id: number;
  public selectedCategories: Number[] = [];
  public selectedTags: Number[] = [];
  public variationCombinations: VariationCombination[] = [];
  public retrieveVariants: boolean = false;
  public variantCount: number = 0;
	public fromDate: NgbDate | null;
	public toDate: NgbDate | null;
  public hoveredDate: NgbDate | null = null;
  public collectionProduct: Select2Data;
  public product: Product;
  private destroy$ = new Subject<void>();

  public productType: Select2Data = [{
    value: 'simple',
    label: 'Simple',
  },{
    value: 'classified',
    label: 'Classified',
  }];

  public stocks: Select2Data = [{
    value: 'in_stock',
    label: 'In Stock',
  },{
    value: 'out_of_stock',
    label: 'Out of Stock',
  }];

  public filter = {
    'search': '',
    'paginate': 15,
    'ids': '',
    'with_union_products': 0,
    'is_approved': 1
  };


  public variants: Variant[] = [{
    id: null,
    attribute_values: null,
    options: null,
    variant_option: null
  }];
  public variations: Variation[] = [];
  private search = new Subject<string>();
  public editor: Editor;
  public html = '';

  constructor(private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document) {


    this.store.dispatch(new GetStores({status: 1, is_approved: 1}));
    this.store.dispatch(new GetAttributes({status: 1}));
    this.store.dispatch(new GetAttributeValues({status: 1}));
    this.store.dispatch(new GetCategories({type: 'product', status: 1}));
    this.store.dispatch(new GetTags({type: 'product', status: 1}));
    this.store.dispatch(new GetTaxes({status: 1}));

    this.attribute$ = this.store.select(AttributeState.attributes)
                        .pipe(map(filterFn => filterFn('')));

    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      short_description: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      store_id: new FormControl(),
      type: new FormControl('simple', [Validators.required]),
      unit: new FormControl(),
      weight: new FormControl(),
      stock_status: new FormControl('in_stock', []),
      sku: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, priceValidator]),
      discount: new FormControl(),
      is_sale_enable: new FormControl(false),
      sale_starts_at: new FormControl(),
      sale_expired_at: new FormControl(),
      tags: new FormControl(),
      categories: new FormControl('', [Validators.required]),
      is_random_related_products: new FormControl(0),
      related_products: new FormControl(),
      cross_sell_products: new FormControl([]),
      product_thumbnail_id: new FormControl(),
      product_galleries_id: new FormControl(),
      size_chart_image_id: new FormControl(),
      variants: this.formBuilder.array([], []),
      variations: this.formBuilder.array([], []),
      attributes_ids: new FormControl([]),
      meta_title: new FormControl(),
      meta_description: new FormControl(),
      product_meta_image_id: new FormControl(),
      safe_checkout: new FormControl(1),
      secure_checkout: new FormControl(1),
      social_share: new FormControl(1),
      encourage_order: new FormControl(1),
      encourage_view: new FormControl(1),
      is_free_shipping: new FormControl(0),
      tax_id: new FormControl('', [Validators.required]),
      estimated_delivery_text: new FormControl(),
      return_policy_text: new FormControl(),
      is_featured: new FormControl(0),
      is_trending: new FormControl(0),
      is_return: new FormControl(1),
      status: new FormControl(1)
    });
  }

  get variantControl(): FormArray {
    
    return this.form.get("variants") as FormArray;
  }

  get variationControl(): FormArray {
    return this.form.get("variations") as FormArray;
  }

  ngOnInit() {
   
    this.search
      .pipe(debounceTime(300)) 
      .subscribe((inputValue) => {
        this.filter['search'] = inputValue;
        this.store.dispatch(new GetProducts(this.filter));
    });

    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditProduct(params['id']))
                      .pipe(mergeMap(() => this.store.select(ProductState.selectedProduct)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(product => {
       
        if(product?.related_products && product?.cross_sell_products ){
          let array =[...product?.related_products, ...product?.cross_sell_products]
          this.filter['paginate'] = array?.length >= 15 ? array?.length: 15;
          this.filter['ids'] = array?.join();
          this.filter['with_union_products'] = array?.length ? array?.length >= 15 ? 0 : 1 : 0;
        }
        this.store.dispatch(new GetProducts(this.filter)).subscribe({
          next: () => {
    
            this.fromDate = product?.sale_starts_at ? convertToNgbDate(this.formatter.parse(product?.sale_starts_at)!) : null;
            this.toDate = product?.sale_expired_at ? convertToNgbDate(this.formatter.parse(product?.sale_expired_at)!) : null;
            
           
            this.selectedCategories = product?.categories.map(value => value?.id!)!;
            
            this.selectedTags = product?.tags.map(value => value?.id!)!;
          
            let attributes = product?.attributes.map((value) => value?.id);
            let galleries = product?.product_galleries.map((value) => value?.id);
           
            if(product) this.product = product;
           
            
            this.id = product?.id!;
            this.form.patchValue({
              name: product?.name,
              short_description: product?.short_description,
              description: product?.description,
              store_id: product?.store_id,
              type: product?.type,
              unit: product?.unit,
              weight: product?.weight,
              stock_status: product?.stock_status,
              sku: product?.sku,
              quantity: product?.quantity,
              price: product?.price,
              discount: product?.discount,
              is_sale_enable: product?.is_sale_enable,
              sale_starts_at: product?.sale_starts_at,
              sale_expired_at: product?.sale_expired_at,
              tags: this.selectedTags,
              categories: this.selectedCategories,
              is_random_related_products: product?.is_random_related_products,
              related_products: product?.related_products,
              cross_sell_products: product?.cross_sell_products,
              product_thumbnail_id: product?.product_thumbnail_id,
              product_galleries_id: galleries,
              size_chart_image_id: product?.size_chart_image_id,
              attributes_ids: attributes,
              meta_title: product?.meta_title,
              meta_description: product?.meta_description,
              product_meta_image_id: product?.product_meta_image_id,
              safe_checkout: product?.safe_checkout,
              secure_checkout: product?.secure_checkout,
              social_share: product?.social_share,
              encourage_order: product?.encourage_order,
              encourage_view: product?.encourage_view,
              is_free_shipping: product?.is_free_shipping,
              is_return: product?.is_return,
              tax_id: product?.tax_id,
              estimated_delivery_text: product?.estimated_delivery_text,
              return_policy_text: product?.return_policy_text,
              is_featured: product?.is_featured,
              is_trending: product?.is_trending,
              status: product?.status,
            });

            // Create Variants
            let variants = attributes?.map(attr => {
              let matchingVariations = product?.variations.filter(variation => {
                return variation.attribute_values.some(attrVal => attrVal?.attribute_id == attr);
              });

              let attributeValues = matchingVariations?.reduce((acc: any, variation) => {
                let values = variation.attribute_values.filter(attrVal => attrVal?.attribute_id == attr).map(attrVal => attrVal?.id);
                return values ? [...new Set([...acc, ...values])] : acc;
              }, []);

              let options = matchingVariations?.reduce((acc: any, variation) => {
                let attrVal = variation.attribute_values.find(attrVal => attrVal.attribute_id == attr);
                  if (!acc.some((opt: any) => opt?.value == attrVal?.id)) {
                    acc.push({ label: attrVal?.value, value: attrVal?.id });
                  }
                return acc;
              }, []);

              return { id: attr, attribute_values: attributeValues, options: options, variant_option: [] };
            });

            // Set Variants and Variations
            this.variants = <any>variants;
            this.variations = product?.variations!;

            if(product?.type == 'classified') {
              this?.variants?.forEach(variant => {
                  this.variantControl.push(
                    this.formBuilder.group({
                      id: new FormControl(variant?.id, []),
                      attribute_values: new FormControl(variant?.attribute_values, []),
                      options: new FormControl(variant?.options, []),
                      variant_option: new FormControl(variant?.variant_option, [])
                    })
                  )
                }
              );
              this.retrieveVariants = true;
            } else {
              this.clearVariations();
            }
          }
        })


      });

    if(this.type == 'create') {
      this.variants.forEach(variant =>
        this.variantControl.push(
          this.formBuilder.group({
            id: new FormControl(variant?.id, []),
            attribute_values: new FormControl(variant?.attribute_values, []),
            options: new FormControl(variant?.attribute_values, []),
            variant_option: new FormControl(variant?.variant_option, [])
          })
        )
      );

    }

    this.variantControl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((variantValue) => {


        let selectedAttr = variantValue.filter((el: any) => el.id != null).map((val: Variant) => val.id);
        this.attribute$  = this.store.select(AttributeState.attributes)
                              .pipe(map(filterFn => filterFn(selectedAttr.join(','))));

        let variantValues = variantValue.filter((el: any) => el.attribute_values != null);
        let attributesIds = variantValues?.map((attr: Variant) => attr.id);

        this.form.controls['attributes_ids'].setValue(attributesIds);

        this.variationCombinations = this.generateCombinations(variantValues);

        this.addVariation();

    });

    this.products$.subscribe(product => {
      this.collectionProduct = product?.length ? product.filter(res => res?.data?.type == 'simple' && res?.data?.stock_status == 'in_stock') : [];
    })

    this.setting$.subscribe(setting => {
      if(setting?.activation?.multivendor) {
        this.form.controls['store_id'].setValidators([Validators.required]);
      } else {
        this.form.controls['store_id'].removeValidators([]);
      }
    });

    this.form.controls['type'].valueChanges.subscribe(value => {
      if(value == 'simple') {
        this.form.setControl('quantity', new FormControl('', [Validators.required]));
        this.form.setControl('price', new FormControl('', [Validators.required]));
        this.form.setControl('discount', new FormControl());
      } else {
        this.form.removeControl('quantity');
        this.form.removeControl('price');
        this.form.removeControl('discount');
      }
    });
    this.editor = new Editor();
  }

  productFilter(filter: Params){
    this.filter['search'] = filter['search'];
    this.filter['ids'] = this.filter['search'].length ? '' : this.product?.related_products?.join()
    this.filter['paginate'] = this.product?.related_products?.length >= 15 ? this.product?.related_products?.length: 15;
    this.store.dispatch(new GetProducts(this.filter));
    this.renderer.addClass(this.document.body, 'loader-none');
  }

  productDropdown(event: Select2){
    if(event['innerSearchText']){
      this.search.next('');
    }
  }

  searchProduct(event: Select2SearchEvent){
    this.search.next(event.search);
  }


  addVariant(event: Event) {
    event.preventDefault();
    this.variantControl.push(
      this.formBuilder.group({
        id: new FormControl(),
        attribute_values: new FormControl(),
        options: new FormControl(),
        variant_option: new FormControl()
      })
    );
  }

  removeVariant(index: number) {
    if(this.variantControl.length <= 1) return
      this.variantControl.removeAt(index);
  }

  getAttributeValues(id: number | null): Observable<any> {
    return this.store.select(AttributeState.attribute_value)
            .pipe(map(filterFn => filterFn(id ? id : null)));
  }

  updateAttribute(data: Select2UpdateEvent, index: number) {
    const variantControl = this.form.get('variants') as FormArray; 
    const control = variantControl.at(index); 

    let variant_option = null;
    this.getAttributeValues(data ? +data?.value : null).subscribe(option => variant_option = option);
    control.patchValue({ variant_option: variant_option }); 
    this.variantCount++
    if(!this.retrieveVariants) {
      control.patchValue({ attribute_values: null, options: null }); 
    }
    if(this.variantCount == this.variants?.length) {
      this.retrieveVariants = false;
    }
  }

  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}

    if(this.fromDate)
      this.form.controls['sale_starts_at'].setValue(`${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`);
    if(this.toDate)
      this.form.controls['sale_expired_at'].setValue(`${this.toDate?.year}-${this.toDate?.month}-${this.toDate?.day}`);
	}

  isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

  isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

  isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

  updateAttributeValue(data: Select2UpdateEvent, index: number) {
    const variantControl = this.form.get('variants') as FormArray;
    const control = variantControl.at(index);
    control.patchValue({ options: data?.options });
  }

  clearVariations() {
    const variantsControl = this.form.get('variations') as FormArray;   
    variantsControl.clear();
  }

  addVariation() {
    this.clearVariations();
    if(this.variationCombinations.length) {
      this.variationCombinations.forEach((variation) => {
          const index = this.variations.findIndex(value =>
              value.attribute_values.every(item => variation?.attribute_values.includes(+item?.id!))
            );
          let variationValue;
          if(index != -1 && this.variations[index]) {
            variationValue = this.variations[index];
          }
          this.variationControl.push(
            this.formBuilder.group({
              id: new FormControl(variationValue?.id, []),
              variation_name: new FormControl(variation?.name, []),
              name: new FormControl(variationValue?.name, [Validators.required]),
              price: new FormControl(variationValue?.price, [Validators.required, priceValidator]),
              discount: new FormControl(variationValue?.discount, []),
              stock_status: new FormControl(variationValue?.stock_status ? variationValue?.stock_status : 'in_stock', [Validators.required]),
              sku: new FormControl(variationValue?.sku, [Validators.required]),
              quantity: new FormControl(variationValue?.quantity, [Validators.required]),
              variation_image_id: new FormControl(variationValue?.variation_image_id, []),
              variation_image: new FormControl(variationValue?.variation_image, []),
              attribute_values: new FormControl(variation?.attribute_values, []),
              status: new FormControl(variationValue ? +variationValue?.status : 1)
            })
          )
        }
      );
    }
  }

  removeVariation(index: number) {
    if(this.variationControl.length <= 1) return
      this.variationControl.removeAt(index);
  }

  selectCategoryItem(data: Number[]) {
    if(Array.isArray(data)) {
      this.form.controls['categories'].setValue(data);
    }
  }

  selectTagItem(data: Number[]) {
    if(Array.isArray(data)) {
      this.form.controls['tags'].setValue(Array.isArray(data) ? data : []);
    }
  }

  selectThumbnail(data: Attachment) {
    if(!Array.isArray(data)) {
      this.form.controls['product_thumbnail_id'].setValue(data ? data.id : null);
    }
  }

  selectImages(data: Attachment) {
    let ids = Array.isArray(data) ? data?.map(image => image.id) : [];
    this.form.controls['product_galleries_id'].setValue(ids);
  }

  selectSizeImage(data: Attachment) {
    if(!Array.isArray(data)) {
      this.form.controls['size_chart_image_id'].setValue(data ? data.id : null);
    }
  }

  selectMetaImage(data: Attachment) {
    if(!Array.isArray(data)) {
      this.form.controls['product_meta_image_id'].setValue(data ? data.id : null);
    }
  }

  selectVariationImage(data: Attachment, index: number) {
    const variationControl = this.form.get('variations') as FormArray;
    const control = variationControl.at(+index);
    control.patchValue({ variation_image_id: data ? data.id : '' });
  }

  // Combination Of Variations
  generateCombinations(attributes: Variant[], index = 0, prefix = '', attribute_values: number[] = []): any {

    if (index >= attributes.length) {

      if(!attribute_values.length) return [];
      // End of recursion
      return [{ name: prefix.replace(/\/$/, ''), attribute_values }];

    }

    const currentAttribute = attributes[index];
    const currentOptions = currentAttribute.options;
    const combinations = [];

    if (currentOptions?.length === 1) {
      // If attribute has only one option, include it in the prefix and IDs  product_meta_image
      const currentOption = currentOptions[0];
      const newPrefix = `${prefix}${currentOption.label}/`;
      const newIds: number[] = [...attribute_values, ...currentAttribute?.attribute_values!];

      const childCombinations = this.generateCombinations(
        attributes, index + 1, newPrefix, newIds
      );

      combinations.push(...childCombinations);
    } else {
      // If attribute has multiple options, generate separate combinations for each option
      for (let i = 0; i < currentOptions?.length!; i++) {
        const currentOption = currentOptions?.[i]!;
        const currentValue = currentOption?.value;
        const newPrefix = `${prefix}${currentOption.label}/`;
        const newIds: number[] = [...attribute_values, currentValue];

        const childCombinations = this.generateCombinations(
          attributes, index + 1, newPrefix, newIds
        );

        combinations.push(...childCombinations);
      }
    }

    return combinations;
  }

  submit() {
    this.form.markAllAsTouched();
   
    let action = new CreateProduct(this.form.value);

    // If product type simple then clear all variation
    if(this.form.controls['type'].value == 'simple') {
      this.form.controls['attributes_ids'].setValue([]);
      this.clearVariations();
    }

    if(this.type == 'edit' && this.id) {
      action = new UpdateProduct(this.form.value, this.id);
    }

    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => {
          this.form.controls['product_thumbnail_id'].setValue('');
          this.form.controls['product_galleries_id'].setValue('');
          this.router.navigateByUrl('/product');
        }
      });
      this.tabError = null;
    } else {
      const invalidField = Object?.keys(this.form?.controls).find(key => this.form.controls[key].invalid);
      const div = document.querySelector(`#${invalidField}`)?.closest('div.tab')?.getAttribute("tab");
      if(div) {
        this.nav.select(div);
        this.tabError = div;
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
