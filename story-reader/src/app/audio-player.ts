import { Component, ElementRef, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var Plyr: any;

@Component({
  selector: 'audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.css'
})
export class AudioPlayer implements AfterViewInit {
  @Input() src?: string;
  @Output() timeUpdate = new EventEmitter<Event>();
  @Output() ended = new EventEmitter<Event>();
  @ViewChild('audio') audioRef!: ElementRef<HTMLAudioElement>;
  private player?: any;

  ngAfterViewInit() {
    const audioEl = this.audioRef?.nativeElement;
    if (!audioEl) return;

    if (typeof Plyr !== 'undefined') {
      this.player = new Plyr(audioEl, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume']
      });
      this.player.on('timeupdate', (ev: Event) => {
        console.log('Audio timeupdate emitted', this.player.currentTime);
        this.timeUpdate.emit(ev);
      });
      this.player.on('ended', (ev: Event) => this.ended.emit(ev));
      if (this.src) {
        this.setSource(this.src);
      }
    } else {
      audioEl.addEventListener('timeupdate', (ev) => {
        console.log('Audio timeupdate emitted', audioEl.currentTime);
        this.timeUpdate.emit(ev);
      });
      audioEl.addEventListener('ended', (ev) => this.ended.emit(ev));
    }
  }

  setSource(src: string) {
    this.src = src;
    if (this.player) {
      this.player.source = { type: 'audio', sources: [{ src, type: 'audio/mp3' }] };
    } else if (this.audioRef) {
      this.audioRef.nativeElement.src = src;
    }
  }

  play() {
    if (this.player) {
      this.player.play();
    } else if (this.audioRef) {
      this.audioRef.nativeElement.play();
    }
  }

  loadAndPlay(src: string) {
    this.setSource(src);
    if (this.audioRef) {
      this.audioRef.nativeElement.load();
    }
    this.play();
  }

  get currentTime(): number {
    if (this.player) return this.player.currentTime;
    return this.audioRef.nativeElement.currentTime;
  }

  get duration(): number {
    if (this.player) return this.player.duration;
    return this.audioRef.nativeElement.duration;
  }
}
