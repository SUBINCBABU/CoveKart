import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Blog, BlogModel } from "../interface/blog.interface";

@Injectable({
  providedIn: "root",
})
export class BlogService {

  constructor(private http: HttpClient) {}
 

  getBlogs(payload?: Params): Observable<BlogModel> {
    return this.http.get<BlogModel>(`${environment.configUrl}getBlog`, { params: payload as any });
  }
  

  createBlog(blog: Blog): Observable<Blog> {
    return this.http.post<Blog>(`${environment.configUrl}createBlog`, blog);
  }

  
  
EditBlog(id?: number): Observable<Blog> {
  return this.http.get<Blog>(`${environment.configUrl}editBlog/${id}`);
}

updateBlog(id?: number, payload?: Blog): Observable<Blog> {
  return this.http.post<Blog>(`${environment.configUrl}updateBlog/${id}`, payload);
}

DeleteBlog(id?: number): Observable<Blog> {
  return this.http.delete<Blog>(`${environment.configUrl}deleteBlog/${id}`,);
}

deleteAllBlog(ids: number[]): Observable<void> {
  return this.http.post<void>(`${environment.configUrl}deleteAllBlog`, { ids });
}

updateBlogStatus(id: number, status: boolean): Observable<Blog> {
  return this.http.post<Blog>(`${environment.configUrl}updateBlogStatus/${id}`, { status });
}

}
