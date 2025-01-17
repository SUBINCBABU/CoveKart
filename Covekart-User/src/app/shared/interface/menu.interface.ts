export interface Menu {
    id?: number;
    path?: string;
    params?: any;
    title?: string;
    type?: string;
    active?: boolean;
    image?: string;
    megaMenuType?: string;
    badge?: string;
    megaMenu?: boolean;
    children?: Menu[];
    subChildren?: Menu[];
    slider?: string;
    class?: string;
    label? : string;
    labelClass?: string;
}

export interface MobileMenu {
  id?: number,
  active?: boolean,
  title?: string,
  icon?: string,
  path?: string
}
