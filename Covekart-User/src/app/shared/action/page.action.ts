import { ContactUsModel } from "../interface/page.interface";

export class GetFaqs {
  static readonly type = "[Faq] Get";
}

export class ContactUs {
  static readonly type = "[ContactUs] Post";
  constructor(public payload: ContactUsModel) {}
}
