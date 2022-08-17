import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Book } from '../../shared/book';
import { BookStoreService } from '../../shared/book-store.service';
import { BodosValidatorService } from '../shared/bodos-validator.service';

@Component({
  selector: 'bm-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit, OnChanges {
  @Input() book: Book | undefined | null;
  @Input() isNew: boolean = false;
  @Input() saved: boolean = false;
  @Input() successMsg = '';
  editForm!: FormGroup;
  @Output() saveBookEventEmitter = new EventEmitter();

  constructor(
    //private route: ActivatedRoute,
    //private router: Router,
    private bookStoreService: BookStoreService,
    private fb: FormBuilder,
    private isbnValidatorServ: BodosValidatorService
  ) {}

  ngOnInit(): void {
    let isbnControl!: FormControl;
    if (this.isNew) {
      isbnControl = new FormControl('', {
        validators: [Validators.required, this.isbnValidatorServ.checkIsbn],
        asyncValidators: [this.isbnValidatorServ.asyncIsbnExistsValidator()]
      });
    } else {
      isbnControl = new FormControl('', [
        Validators.required,
        this.isbnValidatorServ.checkIsbn
      ]);
    }

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: '',
      isbn: isbnControl,
      published: [new Date('2022-08-10'), Validators.required],
      description: '',
      rating: [null, [Validators.min(0), Validators.max(5)]]
    });
    if (this.isNew) {
      this.fillEmptyBook();
    } else if (this.book) {
      this.fillForm(this.book);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    const { aBook, isNew, saved, successMsg } = changes;
    if (aBook?.currentValue && !this.isNew && this.editForm) {
      this.fillForm(aBook.currentValue);
    }
  }

  private fillEmptyBook() {
    const authors = this.fb.array([], [this.isbnValidatorServ.checkAuthors]);
    authors.push(new FormControl(''));
    this.editForm.setControl('authors', authors);
    const thbArray = this.fb.array([]) as FormArray;
    thbArray.push(
      this.fb.group({
        url: '',
        title: ''
      })
    );
    this.editForm.setControl('thumbnails', thbArray);
  }

  private fillForm(book: Book) {
    this.editForm.get('title')?.setValue(book.title);
    this.editForm.get('subtitle')?.setValue(book.subtitle + '');
    this.editForm.get('isbn')?.setValue(book.isbn + '');
    this.editForm.get('description')?.setValue(book.description + '');
    this.editForm.get('published')?.setValue(book.published);
    this.editForm.get('rating')?.setValue(book.rating);

    let authors = this.fb.array([]);
    for (let author of book.authors) {
      const fcAuthor = new FormControl(author);
      authors.push(fcAuthor);
    }
    this.editForm.setControl('authors', authors);

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
    if (this.editForm.valid) {
      this.saveBookEventEmitter.emit(this.editForm.value as Book);
    } else {
      throw new Error('bookFormSave called although form is not valid!');
    }
  }

  addAuthor() {
    const fcAuthor = new FormControl('');
    this.authors.push(fcAuthor);
  }

  removeAuthor(i: number) {
    this.authors.removeAt(i);
  }

  addThumb() {
    //console.log('add thumb called in book-form');
    const thumbG = this.fb.group({
      url: '',
      title: ''
    });
    this.thumbnails.push(thumbG);
  }

  removeThumb(j: number) {
    this.thumbnails.removeAt(j);
  }
}
