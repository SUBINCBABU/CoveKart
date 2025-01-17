import { Component, Inject, ViewChild, Renderer2, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, NgPlural } from '@angular/common';
import { Router } from '@angular/router';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { Select2Data, Select2UpdateEvent } from 'ng-select2-component';
import { Params } from '../../shared/interface/core.interface';
import { GetOrders } from '../../shared/action/order.action';
import { TableClickedAction, TableConfig } from "../../shared/interface/table.interface";
import { Order, OrderModel } from '../../shared/interface/order.interface';
import { OrderState } from '../../shared/state/order.state';
import { GetReviews } from '../../shared/action/review.action';
import { ReviewModel } from '../../shared/interface/review.interface';
import { ReviewState } from '../../shared/state/review.state';
import { Product, ProductModel } from "../../shared/interface/product.interface";
import { ProductState } from '../../shared/state/product.state';
import { GetProducts } from '../../shared/action/product.action';
import { BlogModel } from "../../shared/interface/blog.interface";
import { BlogState } from '../../shared/state/blog.state';
import { GetBlogs } from '../../shared/action/blog.action';
import { CategoryState } from '../../shared/state/category.state';
import { GetCategories } from '../../shared/action/category.action';
import { GetRevenueChart, GetStatisticsCount } from '../../shared/action/dashboard.action';
import { DashboardState } from '../../shared/state/dashboard.state';
import { RevenueChart, StatisticsCount } from '../../shared/interface/dashboard.interface';
import { StoresModel } from '../../shared/interface/store.interface';
import { StoreState } from '../../shared/state/store.state';
import { GetStores } from '../../shared/action/store.action';
import { CurrencySymbolPipe } from './../../shared/pipe/currency-symbol.pipe';
import { AccountState } from '../../shared/state/account.state';
import { AccountUser } from '../../shared/interface/account.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [CurrencySymbolPipe]
})
export class DashboardComponent {

  @Select(DashboardState.statistics) statistics$: Observable<StatisticsCount>;
  @Select(DashboardState.revenueChart) revenueChart$: Observable<RevenueChart>;
  @Select(OrderState.order) order$: Observable<OrderModel>;
  @Select(ProductState.product) product$: Observable<ProductModel>;
  @Select(ProductState.topSellingProducts) topProduct$: Observable<Product[]>;
  @Select(ReviewState.review) review$: Observable<ReviewModel>;
  @Select(BlogState.blog) blog$: Observable<BlogModel>;
  @Select(CategoryState.categories) category$: Observable<Select2Data>;
  @Select(StoreState.store) store$: Observable<StoresModel>;
  @Select(AccountState.user) user$: Observable<AccountUser>;

  public topProductLoader: boolean = false;
  public productStockLoader: boolean = false;
  public topSellerLoader: boolean = false;

  isBrowser: boolean;

  public filter: Select2Data = [{
    value: 'today',
    label: 'Today',
  },
  {
    value: 'last_week',
    label: 'Last Week',
  },
  {
    value: 'last_month',
    label: 'Last Month',
  },
  {
    value: 'this_year',
    label: 'This Year',
  }];

  public sellerTableConfig: TableConfig = {
    columns: [
      { title: "store_name", dataField: "store_name" },
      { title: "orders", dataField: "orders_count" },
      { title: "earning", dataField: "order_amount" },
    ],
    data: [],
    total: 0
  };

  public orderTableConfig: TableConfig = {
    columns: [
      { title: "number", dataField: "order_id" },
      { title: "date", dataField: "created_at", type: "date", date_format: 'dd MMM yyyy' },
      { title: "name", dataField: "consumer_name" },
      { title: "amount", dataField: "total", type: 'price' },
      { title: "payment", dataField: "order_payment_status" }
    ],
    rowActions: [
      { label: "View", actionToPerform: "view", icon: "ri-eye-line", permission: "order.edit" }
    ],
    data: [],
    total: 0
  };

  public productStockTableConfig: TableConfig = {
    columns: [
      { title: "image", dataField: "product_thumbnail", class: 'tbl-image', type: 'image', placeholder: 'assets/images/product.png' },
      { title: "name",  dataField: "name" },
      { title: "quantity", dataField: "quantity" },
      { title: "stock", dataField: "stock" }
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "product.edit"  },
    ],
    data: [] as Product[],
    total: 0
  };

  constructor(private renderer: Renderer2, config: NgbRatingConfig,
    @Inject(PLATFORM_ID) platformId: object,
    @Inject(DOCUMENT) private document: Document,
    private store: Store, private router: Router, currencySymbolPipe: CurrencySymbolPipe) { 
    config.max = 5;
    config.readonly = true;  
    
    this.isBrowser = isPlatformBrowser(platformId);

    let chartOptions = {
      series: [
        {
          name: "Revenue",
          data: [],
          color: '#0da487',
        },
        {
          name: "Comission",
          data: [],
          color: '#FFA53B',
        },
      ],
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          top: 10,
          left: 0,
          blur: 3,
          color: '#720f1e',
          opacity: 0.1
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        strokeWidth: 4,
        strokeColors: "#ffffff",
        hover: {
          size: 9,
        }
      },
      stroke: {
        curve: 'smooth',
        lineCap: 'butt',
        width: 4,
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false,
          }
        }
      },
      legend: {
        show: false,
      },
      responsive: [{
          breakpoint: 1200,
          options: {
            grid: {
              padding: {
                right: -95,
              }
            },
          },
        },
        {
          breakpoint: 992,
          options: {
            grid: {
              padding: {
                right: -69,
              }
            },
          },
        },
        {
          breakpoint: 767,
          options: {
            chart: {
              height: 200,
            }
          },
        },
        {
          breakpoint: 576,
          options: {
            yaxis: {
              labels: {
                show: false,
              },
            },
          },
        }
      ],
      xaxis: {
        categories: [],
        range: undefined,
        axisBorder: {
          offsetX: 0,
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
    }

    // Revenue & Commision Chart
    this.revenueChart$.subscribe(revenue => {
      if(revenue) {
        chartOptions = {
          series: [
            {
              name: "Revenue",
              data: revenue.revenues,
              color: '#0da487',
            },
            {
              name: "Comission",
              data: revenue.commissions,
              color: '#FFA53B',
            },
          ],
          chart: {
            height: 350,
            type: "line",
            dropShadow: {
              enabled: true,
              top: 10,
              left: 0,
              blur: 3,
              color: '#720f1e',
              opacity: 0.1
            },
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            strokeWidth: 4,
            strokeColors: "#ffffff",
            hover: {
              size: 9,
            }
          },
          stroke: {
            curve: 'smooth',
            lineCap: 'butt',
            width: 4,
          },
          grid: {
            xaxis: {
              lines: {
                show: true
              }
            },
            yaxis: {
              lines: {
                show: false,
              }
            }
          },
          legend: {
            show: false,
          },
          responsive: [{
              breakpoint: 1200,
              options: {
                grid: {
                  padding: {
                    right: -95,
                  }
                },
              },
            },
            {
              breakpoint: 992,
              options: {
                grid: {
                  padding: {
                    right: -69,
                  }
                },
              },
            },
            {
              breakpoint: 767,
              options: {
                chart: {
                  height: 200,
                }
              },
            },
            {
              breakpoint: 576,
              options: {
                yaxis: {
                  labels: {
                    show: false,
                  },
                },
              },
            }
          ],
          xaxis: {
            categories: revenue.months,
            range: undefined,
            axisBorder: {
              offsetX: 0,
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
        };
        if (this.isBrowser) {
          const ApexCharts = require('apexcharts');
          const chart = new ApexCharts(document.querySelector('#chart'), chartOptions);
          chart.render();
        }
      }
    });

    // For Order
    this.order$.subscribe(order => { 
      this.orderTableConfig.data = order ? order?.data.slice(0,5) : [];
      this.orderTableConfig.total = order ? order?.total : 0;
    });

    this.order$.subscribe(order => {
      let orders = order?.data?.filter((element: Order) => {
        element.order_id = `<span class="fw-bolder">#${element.order_number}</span>`;
        element.order_payment_status = element.payment_status ? `<div class="status-${element.payment_status.toLowerCase()}"><span>${element.payment_status.replace(/_/g, " ")}</span></div>` : '-';
        element.consumer_name = `<span class="text-capitalize">${element.consumer.name}</span>`;
        return element;
      });
      this.orderTableConfig.data = order ? orders?.slice(0,5) : [];
      this.orderTableConfig.total = order ? order?.total : 0;
    });

    // For Product
    this.product$.subscribe(product => {
      let products = product?.data?.filter((element: Product) => {
        element.stock = element.stock_status ? `<div class="status-${element.stock_status}"><span>${element.stock_status.replace(/_/g, " ")}</span></div>` : '-';
        return element;
      });
      this.productStockTableConfig.data = product ? products.slice(0,8) : [];
      this.productStockTableConfig.total = product ? product?.total : 0;
    });

    // For Store
    this.store$.subscribe(store => { 
      this.sellerTableConfig.data  = store ? store?.data?.slice(0,6) : [];
      this.sellerTableConfig.total = store ? store?.total : 0;
    });
  }

  ngOnInit() {
    this.store.dispatch(new GetStatisticsCount());
    this.store.dispatch(new GetRevenueChart());
    this.store.dispatch(new GetProducts({ status: 1, top_selling: 1, filter_by: 'this_year', paginate: 5}));
    this.store.dispatch(new GetReviews({ paginate: 5 }));
    this.store.dispatch(new GetBlogs({ status: 1, paginate: 2 }));
    this.store.dispatch(new GetCategories({ type: 'product', status: 1 }));
  }

  filterTopProduct(data: Select2UpdateEvent) {
    this.topProductLoader = true;
    this.renderer.addClass(this.document.body, 'loader-none');
    let params: Params = { status: 1, top_selling: 1, filter_by: 'this_year', paginate: 5 };
    if(data.value) {
      params['filter_by'] = data.value;
    }
    this.store.dispatch(new GetProducts(params)).subscribe({
      complete: () => { this.topProductLoader = false }
    });
  }

  // For Order

  onOrderTableChange(data?: Params) { 
    if(data) { 
      data['paginate'] = 7;
    }
    this.store.dispatch(new GetOrders(data!));
  }

  onOrderActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'view')
      this.orderView(action.data)
  }

  orderView(data: Order) {
    this.router.navigateByUrl(`/order/details/${data.order_number}`);
  }

  // For Products

  onProductTableChange(data?: Params) {
    if(data) { 
      data['paginate'] = 8;
      data['field'] = 'quantity';
      data['sort'] = 'asc';
    }
    this.store.dispatch(new GetProducts(data)).subscribe({
      complete: () => {
        this.productStockLoader = false;
      }
    });
  }

  filterProduct(data: Select2UpdateEvent) {
    this.renderer.addClass(this.document.body, 'loader-none');
    let params: Params = {
      paginate: 8,
      field: 'quantity',
      sort: 'asc'
    };
    if(data.value) {
      params['category_ids'] = data.value;
    }
    this.productStockLoader = true;
    this.onProductTableChange(params);
  }

  onProductActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.productEdit(action.data)
  }

  productEdit(data: Product) {
    this.router.navigateByUrl(`/product/edit/${data.id}`);
  }

  // For Seller

  onSellerTableChange(data?: Params) {
    if(data && !data['filter_by']) { 
      data['paginate'] = 6;
      data['top_vendor'] = 1;
      data['filter_by'] = 'this_year';
    }
    this.store.dispatch(new GetStores(data)).subscribe({
      complete: () => {
        this.topSellerLoader = false;
      }
    });
  }

  filterSeller(data: Select2UpdateEvent) {
    this.renderer.addClass(this.document.body, 'loader-none');
    let params: Params = {
      paginate: 6,
      top_vendor: 1,
      filter_by: 'this_year'
    };
    if(data.value) {
      params['filter_by'] = data.value;
    }
    this.topSellerLoader = true;
    this.onSellerTableChange(params);
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'loader-none');
  }

}
