import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  prompt = '';
  audioUrl?: string;

  async generate() {
    if (!this.prompt) return;
    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: this.prompt })
      });
      const blob = await response.blob();
      this.audioUrl = URL.createObjectURL(blob);
    } catch (err) {
      console.error('Failed to fetch story', err);
    }
  }
}
