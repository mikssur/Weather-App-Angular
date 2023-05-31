import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { calculateAverage } from './weather.utils';

interface AverageTemperature {
  date: string;
  averageTemperature: number;
}

interface Weather {
  description: string;
  icon: string;
  main: string;
}

interface CurrentWeather {
  clouds: {
    all: number;
  };
  coord: { lon: number; lot: number };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  name: string;
  timezone: number;
  visibility: number;
  weather: Weather[];
  wind: { speed: number; deg: number };
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  city: string = 'Helsinki';
  error: string = '';
  averageTemperatures: AverageTemperature[] = [];
  currentWeather: CurrentWeather | null = null;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.searchWeather();
  }

  // combineArrays(
  //   data: number[],
  //   time: string[]
  // ): { value: number; timestamp: string }[] {
  //   const combined: { value: number; timestamp: string }[] = [];
  //   for (let i = 0; i < data.length; i++) {
  //     combined.push({ value: data[i], timestamp: time[i] });
  //   }
  //   return combined;
  // }

  // calculateAverage(
  //   data: number[],
  //   time: string[]
  // ): { date: string; averageTemperature: number }[] {
  //   const combined: { value: number; timestamp: string }[] = this.combineArrays(
  //     data,
  //     time
  //   );

  //   const reduced: { date: string; averageTemperature: number }[] = [];
  //   const dateMap: Map<string, { sum: number; count: number }> = new Map();

  //   for (const item of combined) {
  //     const date = item.timestamp.split('T')[0];

  //     if (dateMap.has(date)) {
  //       const entry: any = dateMap.get(date);

  //       entry.sum += item.value;
  //       entry.count += 1;
  //     } else {
  //       dateMap.set(date, { sum: item.value, count: 1 });
  //     }
  //   }

  //   for (const [date, { sum, count }] of dateMap.entries()) {
  //     const averageTemperature = Math.ceil(sum / count);

  //     reduced.push({ date, averageTemperature });
  //   }

  //   return reduced;
  // }

  searchWeather() {
    this.error = '';

    this.weatherService.getCurrentWeather(this.city).subscribe(
      (data) => {
        this.currentWeather = data;
      },
      (error: object) => {
        this.error = 'City not found or API error occurred.';
        console.log(error);
      }
    );

    this.weatherService.getCoordinates(this.city).subscribe(
      (coordinates) => {
        if (coordinates.length) {
          const { lat, lon } = coordinates[0];

          this.weatherService.getForecast(lat, lon).subscribe(
            (forecast) => {
              this.averageTemperatures = calculateAverage(
                forecast.hourly.temperature_2m,
                forecast.hourly.time
              );
            },
            (error: object) => {
              this.error = 'City not found or API error occurred.';
              console.log(error);
            }
          );
        } else {
          this.error = 'City not found or API error occurred.';
        }
      },
      (error: object) => {
        this.error = 'City not found or API error occurred.';
        console.log(error);
      }
    );
  }
}
