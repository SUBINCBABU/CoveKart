import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { ContentComponent } from './components/layout/content/content.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { FullComponent } from './components/layout/full/full.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageWrapperComponent } from './components/page-wrapper/page-wrapper.component';
import { SearchComponent } from './components/header/widgets/search/search.component';
import { LanguagesComponent } from './components/header/widgets/languages/languages.component';

// UI
import { FeatherIconsComponent } from './components/ui/feather-icons/feather-icons.component';
import { AlertComponent } from './components/ui/alert/alert.component';
import { TableComponent } from './components/ui/table/table.component';
import { PaginationComponent } from './components/ui/pagination/pagination.component';
import { FormFieldsComponent } from './components/ui/form-fields/form-fields.component';
import { ImageUploadComponent } from './components/ui/image-upload/image-upload.component';
import { AdvancedDropdownComponent } from './components/ui/advanced-dropdown/advanced-dropdown.component';
import { DropdownListComponent } from './components/ui/advanced-dropdown/dropdown-list/dropdown-list.component';
import { MediaBoxComponent } from './components/ui/media-box/media-box.component';
import { ButtonComponent } from './components/ui/button/button.component';
import { NoDataComponent } from './components/ui/no-data/no-data.component';
import { ProductBoxSkeletonComponent } from './components/ui/skeleton/product-box-skeleton/product-box-skeleton.component';
import { ProductBoxComponent } from './components/ui/product-box/product-box.component';
import { AddtocartComponent } from './components/ui/product-box/modal/addtocart/addtocart.component';
import { NotificationComponent } from './components/header/widgets/notification/notification.component';
import { ProfileComponent } from './components/header/widgets/profile/profile.component';
import { ModeComponent } from './components/header/widgets/mode/mode.component';
import { SidebarMenuSkeletonComponent } from './components/ui/skeleton/sidebar-menu-skeleton/sidebar-menu-skeleton.component';
import { LinkComponent } from './components/ui/link/link.component';

// Modal Components
import { DeleteModalComponent } from './components/ui/modal/delete-modal/delete-modal.component';
import { MediaModalComponent } from './components/ui/modal/media-modal/media-modal.component';
import { ConfirmationModalComponent } from './components/ui/modal/confirmation-modal/confirmation-modal.component';
import { PayoutModalComponent } from './components/ui/modal/payout-modal/payout-modal.component';
import { ImportCsvModalComponent } from './components/ui/modal/import-csv-modal/import-csv-modal.component';

// Directives
import { ClickOutsideDirective } from './directive/out-side-directive';
import { NumberDirective } from './directive/numbers-only.directive';
import { HasPermissionDirective } from './directive/has-permission.directive';

// Pipes
import { CurrencySymbolPipe } from './pipe/currency-symbol.pipe';
import { SummaryPipe } from './pipe/summary.pipe';

@NgModule({
  declarations: [
    // Components
    ContentComponent,
    HeaderComponent,
    SidebarComponent,
    LoaderComponent,
    FullComponent,
    FooterComponent,
    PageWrapperComponent,
    SearchComponent,
    LanguagesComponent,
    // UI Components
    FeatherIconsComponent,
    AlertComponent,
    TableComponent,
    PaginationComponent,
    FormFieldsComponent,
    ImageUploadComponent,
    AdvancedDropdownComponent,
    DropdownListComponent,
    MediaBoxComponent,
    ButtonComponent,
    NoDataComponent,
    ProductBoxSkeletonComponent,
    ProductBoxComponent,
    AddtocartComponent,
    NotificationComponent,
    ProfileComponent,
    ModeComponent,
    SidebarMenuSkeletonComponent,
    LinkComponent,
    // Modal Components
    DeleteModalComponent,
    MediaModalComponent,
    ConfirmationModalComponent,
    PayoutModalComponent,
    ImportCsvModalComponent,
    // Directives
    ClickOutsideDirective,
    NumberDirective,
    CurrencySymbolPipe,
    HasPermissionDirective,
    // Pipes
    SummaryPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgbModule,
    Select2Module,
    NgxDropzoneModule,
    CarouselModule,
    TranslateModule
  ],
  providers: [CurrencyPipe],
  exports: [
    // Modules
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    Select2Module,
    CarouselModule,
    TranslateModule,
    // Components
    FeatherIconsComponent,
    AlertComponent,
    TableComponent,
    PaginationComponent,
    FormFieldsComponent,
    ImageUploadComponent,
    PageWrapperComponent,
    LoaderComponent,
    AdvancedDropdownComponent,
    NoDataComponent,
    ProductBoxSkeletonComponent,
    ProductBoxComponent,
    AddtocartComponent,
    LinkComponent,
    ButtonComponent,
    MediaBoxComponent,
    // Modals
    DeleteModalComponent,
    MediaModalComponent,
    ConfirmationModalComponent,
    PayoutModalComponent,
    ImportCsvModalComponent,
    // Directives
    NumberDirective,
    HasPermissionDirective,
    // Pipes
    CurrencySymbolPipe,
    SummaryPipe
  ]
})
export class SharedModule { }
