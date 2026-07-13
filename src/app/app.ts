import { Component, signal } from '@angular/core';
import { VoiceOrb } from '@pank4ss/voice-orb-lib';

@Component({
  selector: 'app-root',
  imports: [VoiceOrb],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('voice-orb');
}
