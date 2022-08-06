import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookComponent } from './create-book.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateBookComponent', () => {
  let component: CreateBookComponent;
  let fixture: ComponentFixture<CreateBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateBookComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
