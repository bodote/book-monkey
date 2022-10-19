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

import { BodosValidatorService } from '../shared/bodos-validator.service';
import { BookFactoryService } from '../../shared/book-factory.service';
import { BookEntity } from '../../books/store/book-entity/book-entity.model';

@Component({
  selector: 'bm-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit, OnChanges {
  @Input() aBook: BookEntity | undefined | null;
  @Input() isNew!: boolean;
  @Input() saved!: boolean | null;
  successMsg = 'Book has been saved successfully';
  editForm!: FormGroup;
  @Output() saveBookEventEmitter = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private bodosValidatorService: BodosValidatorService
  ) {}

  ngOnInit(): void {
    this.checkEditForm();
    if (this.isNew) {
      this.fillEmptyBook();
    } else if (this.aBook) {
      this.fillForm(this.aBook);
    }
  }

  private createIsbnControl() {
    if (this.isNew) {
      return new FormControl('', {
        validators: [this.bodosValidatorService.checkIsbn],
        asyncValidators: [this.bodosValidatorService.asyncIsbnExistsValidator()]
      });
    } else {
      return new FormControl(null, [
        Validators.required,
        this.bodosValidatorService.checkIsbn
      ]);
    }
  }

  private checkEditForm() {
    let isbnControl = this.createIsbnControl();
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: '',
      isbn: isbnControl,
      published: [
        new Date().toISOString().substring(0, 10),
        Validators.required
      ],
      description: '',
      rating: [null, [Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkEditForm();
    const { aBook } = changes;
    if (!!aBook && aBook.currentValue && !this.isNew) {
      this.fillForm(aBook.currentValue);
    }
  }

  private fillEmptyBook() {
    const authors = this.fb.array(
      [],
      [this.bodosValidatorService.checkAuthors]
    );
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

  fillForm(book: BookEntity) {
    this.editForm.get('title')?.setValue(book.title);
    this.editForm.get('subtitle')?.setValue(book.subtitle);
    this.editForm.get('isbn')?.setValue(book.isbn + '');
    this.editForm.get('description')?.setValue(book.description);
    const published: string = book.published.toISOString().substring(0, 10);

    this.editForm.get('published')?.setValue(published);
    this.editForm.get('rating')?.setValue(book.rating);

    let authors = this.fb.array([], [this.bodosValidatorService.checkAuthors]);
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
      this.saveBookEventEmitter.emit(
        BookFactoryService.getFromRaw(this.editForm.value)
      );
    } else {
      throw new Error('bookFormSave called although form is not valid!');
    }
  }

  addAuthor() {
    const fcAuthor = new FormControl(null);
    this.authors.push(fcAuthor);
  }

  removeAuthor(i: number) {
    this.authors.removeAt(i);
  }

  addThumb() {
    const thumbG = this.fb.group({});
    this.thumbnails.push(thumbG);
  }

  removeThumb(j: number) {
    this.thumbnails.removeAt(j);
  }
}
