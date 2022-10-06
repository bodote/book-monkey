import { BookFactoryService } from './book-factory.service';
import { BookRaw } from './book-raw';
import { BookEntity } from '../books/store/book-entity/book-entity.model';
import { formatDate } from '@angular/common';

const testBookData: BookEntity = {
  authors: ['author'],
  isbn: '1234567890',
  published: new Date('2022-02-02T23:48:00-11:00'),
  title: 'a title',
  subtitle: '',
  description: '',
  rating: 3,
  thumbnails: [{ title: '', url: '' }]
};
const testBookDataRaw: BookRaw = {
  authors: ['author'],
  isbn: '1234567890',
  published: '2022-02-02T23:48:00-11:00',
  title: 'a title',
  subtitle: '',
  description: '',
  rating: 3,
  thumbnails: [{ title: '', url: '' }]
};
describe('BookFactoryService', () => {
  it('should get an empty book', () => {
    const book = BookFactoryService.getEmptyBook();
    expect(book.title).toEqual('');
    const isoDate = book.published.toISOString();
    expect(isoDate).toContain('1970-01-01');
    expect(book.subtitle).toEqual('');
    expect(book.authors).toEqual([]);
    expect(book.isbn).toEqual('');
    expect(book.description).toEqual('');
  });
  it('should convert from Book to BookRaw', () => {
    const bookEntity = BookFactoryService.getFromRaw(testBookDataRaw);
    expect(bookEntity).toEqual(testBookData);
  });
  it('should convert from BookRaw to Book', () => {
    const convertedRawBook = BookFactoryService.getRawFromBook(testBookData);
    const normalizedRaw = {
      ...testBookDataRaw,
      published: formatDate(
        testBookDataRaw.published,
        'YYYY-MM-ddThh:mm:ssZZ',
        'en'
      )
    };
    expect(convertedRawBook).toEqual(normalizedRaw);
  });
});
