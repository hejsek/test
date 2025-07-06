import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoryService {
  constructor(private http: HttpClient) {}

  generateStory(theme: string): Observable<{ story: string }> {
    return this.http.post<{ story: string }>('/generate-story', { theme });
  }
}
