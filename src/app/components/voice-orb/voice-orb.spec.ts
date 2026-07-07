import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceOrb } from './voice-orb';

describe('VoiceOrb', () => {
  let component: VoiceOrb;
  let fixture: ComponentFixture<VoiceOrb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceOrb],
    }).compileComponents();

    fixture = TestBed.createComponent(VoiceOrb);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
