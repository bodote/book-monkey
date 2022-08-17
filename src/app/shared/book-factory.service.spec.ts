import { BookFactoryService } from './book-factory.service';
import { Book } from './book';
import { BookRaw } from './book-raw';

const testBookData: Book = {
  authors: ['author'],
  isbn: '1234567890',
  published: new Date('2022-02-02'),
  title: 'a title',
  subtitle: '',
  description: '',
  rating: 3,
  thumbnails: [{ title: '', url: '' }]
};
const testBookDataRaw: BookRaw = {
  authors: ['author'],
  isbn: '1234567890',
  published: '2022-02-02',
  title: 'a title',
  subtitle: '',
  description: '',
  rating: 3,
  thumbnails: [{ title: '', url: '' }]
};
describe('BookFactoryService', () => {
  let service: BookFactoryService;

  it('should get an empty book', () => {
    const book = BookFactoryService.getEmptyBook();
    expect(book.title).toEqual('');
    expect(book.published.toISOString()).toContain('2022-02-02');
  });
  it('should convert from Book to BookRaw', () => {
    expect(BookFactoryService.getFromRaw(testBookDataRaw)).toEqual(
      testBookData
    );
  });
  it('should convert from BookRaw to Book', () => {
    const convertedRawBook = BookFactoryService.getRawFromBook(testBookData);
    expect(convertedRawBook).toEqual(testBookDataRaw);
  });
});
