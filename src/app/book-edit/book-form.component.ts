import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Book } from '../shared/book';
import { ActivatedRoute, Router } from '@angular/router';
import { BookStoreService } from '../shared/book-store.service';

@Component({
  selector: 'bm-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit, OnChanges {
  @Input() book: Book | undefined | null;
  @Input() isNew: boolean = false;
  editForm!: FormGroup;
  @Output() saveBookEventEmitter = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookStoreService: BookStoreService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      title: ['empty title', Validators.required],
      subtitle: 'empty sub title',
      isbn: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(13)
        ]
      ],
      published: new Date(),
      description: '',
      rating: ''
    });
    if (this.isNew) {
      this.fillEmptyBook();
    }
  }
  ngOnChanges() {
    if (!this.isNew && this.book) {
      this.fillForm(this.book);
    }
  }

  private fillEmptyBook() {
    const authors = this.fb.array([]);
    authors.push(new FormControl('<author>'));
    this.editForm.setControl('authors', authors);
    const thbArray = this.fb.array([]) as FormArray;
    thbArray.push(
      this.fb.group({
        url: '<url>',
        title: '<title>'
      })
    );
    this.editForm.setControl('thumbnails', thbArray);
  }

  private fillForm(book: Book) {
    this.editForm.get('title')?.setValue(book.title);
    this.editForm.get('subtitle')?.setValue(book.subtitle + '');
    this.editForm.get('isbn')?.setValue(book.isbn + '');
    this.editForm.get('description')?.setValue(book.description + '');
    this.editForm.get('published')?.setValue(book.published + '');
    this.editForm.get('rating')?.setValue(book.rating + '');

    let authors = this.fb.array([]);
    for (let author of book.authors) {
      const fcAuthor = new FormControl(author);
      authors.push(fcAuthor);
    }
    this.editForm.setControl('authors', authors);
    this.editForm.get('isbn')?.valueChanges.subscribe((val) => {
      console.log('val change: ' + JSON.stringify(val));
    });
    if (book.thumbnails) {
      let thumbnails = this.fb.array([] as FormGroup[]);
      for (let thumb of book.thumbnails) {
        const thumbG = this.fb.group({
          url: thumb.url,
          title: thumb.title
        });
        thumbnails.push(thumbG);
      }
      this.editForm.setControl('thumbnails', thumbnails);
    }
  }

  get authors() {
    return this.editForm.get('authors') as FormArray;
  }
  get isbn() {
    return this.editForm.get('isbn');
  }
  get thumbnails() {
    return this.editForm.get('thumbnails') as FormArray;
  }

  bookFormSaveBook() {
    const book = this.editForm.value as Book;
    this.saveBookEventEmitter.emit(book);
  }
}
