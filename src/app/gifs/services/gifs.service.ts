import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey = '1SLqe5XSa7eK1l3j5nQr2Y5xfUczXaQX';
  private servicioUrl = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor( private http: HttpClient ) {
    const historialLS = localStorage.getItem('historial');
    this._historial = historialLS ? JSON.parse(historialLS) : [];

    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];  
  } 

  buscarGifs(query: string) {
    query = query.trim().toLowerCase();

    if (query.trim().length === 0) {
      return;
    }

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe((resp) => {
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
    

  }
}
