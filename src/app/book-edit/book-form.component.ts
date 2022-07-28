import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Book } from '../shared/book';
import { ActivatedRoute, Router } from '@angular/router';
import { BookStoreService } from '../shared/book-store.service';
import { Observable, of, tap } from 'rxjs';
import { BookFactoryService } from '../shared/book-factory.service';

@Component({
  selector: 'bm-book-edit',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  book$!: Observable<Book>;
  editForm!: FormGroup;
  @Output() submitBook = new EventEmitter();

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
      description: ''
    });

    this.route.paramMap.subscribe((params) => {
      if (params?.get('isbn')) {
        let isbn = params.get('isbn');
        this.book$ = this.bookStoreService.getBook(isbn).pipe(
          tap((book) => {
            this.fillForm(book);
          })
        );
      } else {
        this.book$ = of(BookFactoryService.getEmptyBook());
        const authors = this.fb.array([]);
        authors.push(new FormControl('<author>'));
        this.editForm.setControl('authors', authors);
        const thbArray = this.fb.array([]) as FormArray;
        thbArray.push(
          this.fb.group({
            url: '<url>',
            description: '<descr>'
          })
        );
        this.editForm.setControl('thumbnails', thbArray);
      }
    });
  }

  private fillForm(book: Book) {
    this.editForm.get('title')?.setValue(book.title);
    this.editForm.get('subtitle')?.setValue(book.subtitle + '');
    this.editForm.get('isbn')?.setValue(book.isbn + '');
    let authors = this.fb.array([]);
    for (let author of book.authors) {
      const fcAuthor = new FormControl(author);
      authors.push(fcAuthor);
    }
    this.editForm.setControl('authors', authors);
    this.editForm.get('isbn')?.valueChanges.subscribe((val) => {
      console.log('val change: ' + JSON.stringify(val));
    });
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

  submitForm() {
    const book = this.editForm.value as Book;
    this.submitBook.emit(book);
  }
}
