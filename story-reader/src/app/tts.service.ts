import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TtsService {
  constructor(private http: HttpClient) {}

  synthesize(text: string): Observable<Blob> {
    return this.http.post('/tts', { text }, { responseType: 'blob' });
  }
}
