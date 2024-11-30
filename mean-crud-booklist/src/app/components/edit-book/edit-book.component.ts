import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css'],
})
export class EditBookComponent implements OnInit {
  bookForm: FormGroup;
  bookId: string;
  error: string | null = null; // Error message for the user
  loading: boolean = true; // Loading state

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CrudService
  ) {
    this.bookForm = this.formBuilder.group({
      isbn: [''],
      title: [''],
      author: [''],
      description: [''],
      published_year: [''],
      publisher: [''],
    });
    this.bookId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.crudService.GetBook(this.bookId).subscribe({
      next: (data: any) => {
        this.loading = false;
        if (data) {
          this.bookForm.setValue({
            isbn: data.isbn,
            title: data.title,
            author: data.author,
            description: data.description,
            published_year: data.published_year,
            publisher: data.publisher,
          });
        } else {
          this.error = 'Book details not found.';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = 'Failed to load book details. Please try again later.';
        console.error('Error fetching book details:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      console.error('Form is invalid');
      return;
    }
  
    this.crudService.UpdateBook(this.bookId, this.bookForm.value).subscribe({
      next: (response: any) => {
        console.log('Book updated successfully:', response);
        this.router.navigate(['/books-list']);
      },
      error: (err: any) => {
        console.error('Error updating book:', err);
        this.error = 'Failed to update book. Please try again.';
      },
    });
  }  
}
