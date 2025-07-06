import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoryService {
  private readonly apiUrl = 'http://127.0.0.1:8000'; // Adjust the URL as needed
  constructor(private http: HttpClient) {}

  generateStory(theme: string): Observable<{ story: string }> {
    return this.http.post<{ story: string }>(this.apiUrl + '/generate-story', { theme });
  }
}
