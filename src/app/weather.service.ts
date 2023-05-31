import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = 'Your Key here'; // insert your API key for api.openweathermap.org

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<any> {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${this.apiKey}`;
    return this.http.get(url);
  }

  getCoordinates(city: string): Observable<any> {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getForecast(latitude: number, longitude: number): Observable<any> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;
    return this.http.get(url);
  }
}
