import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'booksapp';
  readonly APIUrl = "http://localhost:5038/api/books/";
  books: any = [];
  editingBook: any = null;
  notificationMsg: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.refreshBooks();
  }

  showNotification(message: string) {
    this.notificationMsg = message;
    setTimeout(() => {
      this.notificationMsg = null;
    }, 3000);
  }

  refreshBooks() {
    this.http.get(this.APIUrl + 'GetBooks').subscribe(data => {
      this.books = data;
    });
  }

  addBook() {
    const title = (<HTMLInputElement>document.getElementById("newBook")).value;
    const desc = (<HTMLInputElement>document.getElementById("newDesc")).value;
    const price = (<HTMLInputElement>document.getElementById("newPrice")).value;
    const author = (<HTMLInputElement>document.getElementById("newAuthor")).value;
    const date = (<HTMLInputElement>document.getElementById("newDate")).value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("price", price);
    formData.append("author", author);
    formData.append("publishDate", date);

    this.http.post(this.APIUrl + 'AddBook', formData).subscribe(data => {
      this.showNotification("Book added successfully! ✨");
      this.refreshBooks();
      this.clearInputs(["newBook", "newDesc", "newPrice", "newAuthor", "newDate"]);
    });
  }

  editBook(book: any) {
    this.editingBook = book;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateBook() {
    const title = (<HTMLInputElement>document.getElementById("editTitle")).value;
    const desc = (<HTMLInputElement>document.getElementById("editDesc")).value;
    const price = (<HTMLInputElement>document.getElementById("editPrice")).value;
    const author = (<HTMLInputElement>document.getElementById("editAuthor")).value;
    const date = (<HTMLInputElement>document.getElementById("editDate")).value;

    const formData = new FormData();
    formData.append("id", this.editingBook.id);
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("price", price);
    formData.append("author", author);
    formData.append("publishDate", date);

    this.http.put(this.APIUrl + 'UpdateBook', formData).subscribe(data => {
      this.showNotification("Book updated! 🌸");
      this.editingBook = null;
      this.refreshBooks();
    });
  }

  deleteBook(id: any) {
    this.http.delete(this.APIUrl + 'DeleteBook?id=' + id).subscribe(data => {
      this.showNotification("Book deleted! 🗑️");
      this.refreshBooks();
    });
  }

  private clearInputs(ids: string[]) {
    ids.forEach(id => {
      const el = <HTMLInputElement>document.getElementById(id);
      if (el) el.value = "";
    });
  }
}
