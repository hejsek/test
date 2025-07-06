import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TtsService {
  private readonly apiUrl = 'http://127.0.0.1:8000'; // Adjust the URL as needed
  constructor(private http: HttpClient) {}

  synthesize(text: string): Observable<Blob> {
    return this.http.post(this.apiUrl + '/tts', { text }, { responseType: 'blob' });
  }
}
