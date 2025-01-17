import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WishlistModel } from '../interface/wishlist.interface';
import { Params } from '../interface/core.interface';
import { AuthState } from '../state/auth.state';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  public skeletonLoader: boolean = false;
  
 constructor(private http: HttpClient, private store: Store) {}
   getToken(): string | null {
    
     return this.store.selectSnapshot(AuthState.token); 
   }

  getWishlistItems(): Observable<WishlistModel> {
     const token = this.getToken();
          if (!token) {
            throw new Error("No token found");
          }
          const headers = new HttpHeaders({
            Authorization: `${token}`,
          });
    return this.http.get<WishlistModel>(`${environment.configUrl}getWishlist`,{headers});
  }
  postWishlistItems(payload:Params):Observable<WishlistModel>{
    
    return this.http.post<WishlistModel>(`${environment.configUrl}postWishlist`, payload)
  }
  deleteWishlistItems(id:Number):Observable<any>{
   
      return this.http.delete<any>(`${environment.configUrl}deleteWishlist/${id}`)
  }
  

}
