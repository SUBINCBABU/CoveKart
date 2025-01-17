import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { Product, Variation, SelectedVariant } from '../../../../../interface/product.interface';
import { AttributeValue } from '../../../../../interface/attribute.interface';
import { CartAddOrUpdate } from '../../../../../interface/cart.interface';
import { AddToCart } from '../../../../../action/cart.action';

@Component({
  selector: 'app-addtocart',
  templateUrl: './addtocart.component.html',
  styleUrls: ['./addtocart.component.scss']
})
export class AddtocartComponent {
  
  public modalOpen: boolean = false;
  public closeResult: string;
  public product: Product;
  public productQty: number = 1;

  public attributeValues: number[] = [];
  public variantIds: number[] = [];
  public selectedOptions: SelectedVariant[] = [];

  public selectedVariation: Variation;

  @ViewChild("addToCartModal", { static: false }) addToCartModal: TemplateRef<string>;

  constructor(private modalService: NgbModal,
    private store: Store) { }
    
  async openModal(product: Product) {
    this.checkVariantAvailability(product);
    this.product = product;
    this.modalOpen = true;
    this.modalService.open(this.addToCartModal, {
      ariaLabelledBy: 'AddToCartModal',
      centered: true,
      windowClass: 'theme-modal modal-lg'
    }).result.then((result) => {
      `Result ${result}`
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  checkVariantAvailability(product: Product) {
    product?.variations?.forEach(variation => {
      variation?.attribute_values?.filter(attribute_value => {
        if(this.attributeValues.indexOf(attribute_value?.id!) === -1)
          this.attributeValues.push(attribute_value?.id!);
      });
    });
  }

  setVariant(variations: Variation[], value: AttributeValue) {
    const index = this.selectedOptions.findIndex(item => Number(item.attribute_id) === Number(value?.attribute_id));
    if(index === -1) {
      this.selectedOptions.push({id: Number(value?.id)!, attribute_id: Number(value?.attribute_id)});
    } else {
      this.selectedOptions[index].id = value?.id;
    }
    variations?.forEach(variation => {
      let attrValues = variation?.attribute_values?.map(attribute_value => attribute_value?.id);
      this.variantIds = this.selectedOptions?.map(variants => variants?.id);
      let doValuesMatch = attrValues.length === this.selectedOptions.length && 
                              attrValues.every(value => this.variantIds.includes(value!));
      if(doValuesMatch) {
        this.selectedVariation = variation;
        this.checkStockAvailable();
      }
    });
  }

  updateQuantity(qty: number) {
    if(1 > this.productQty + (qty)) return;
    this.productQty = this.productQty + (qty);
    this.checkStockAvailable();
  }

  checkStockAvailable() {
    if(this.selectedVariation) {
      this.selectedVariation['stock_status'] = this.selectedVariation?.quantity < this.productQty ? 'out_of_stock' : 'in_stock';
    }
  }

  addToCart(product: Product) {
    if(this.selectedVariation) {
      const params: CartAddOrUpdate = {
        id: null,
        product_id: product?.id!,
        product: product,
        variation: this.selectedVariation,
        variation_id: this.selectedVariation?.id!,
        quantity: this.productQty
      }
      this.store.dispatch(new AddToCart(params)).subscribe({
        complete: () => {
          this.modalService.dismissAll();
        }
      });
    }
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

}
