import { Component, OnInit } from '@angular/core';
import { CrudService } from './../../service/crud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements OnInit {

  Books:any = [];
 
  constructor(private crudService: CrudService, private router: Router) { }
 
  ngOnInit(): void {
    this.crudService.GetBooks().subscribe(res => {
      console.log(res)
      this.Books = res;
    });    
  }

  onEdit(id: string): void {
    console.log('Navigating to edit page with book ID:', id);
    this.router.navigate(['/edit-book', id]);
  }

  onDelete(id: any): any {
    this.crudService.DeleteBook(id)
      .subscribe(res => {
        console.log(res)
      })
      location.reload();
  }
}
