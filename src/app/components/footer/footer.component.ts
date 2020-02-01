import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilterButton, Filter } from '../../models/filtering.model';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TodoService } from 'src/app/services/todo.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  filterButton: FilterButton[] = [
    { type: Filter.All, label: 'All', isActive: true },
    { type: Filter.Active, label: 'Active', isActive: false },
    { type: Filter.Completed, label: 'Completed', isActive: false }
  ];

  length: number = 0;
  hasComplete$: Observable<boolean>;
  destroy$: Subject<any> = new Subject<any>();
  test: any;
  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.hasComplete$ = this.todoService.todos$.pipe(
      map(todos => todos.some(t => t.isCompleted)),
      takeUntil(this.destroy$)
    );

    this.todoService.length$
      .pipe(takeUntil(this.destroy$))
      .subscribe(length => (this.length = length));
  }

  filter(type: Filter) {
    this.todoService.filterTodos(type);
  }

  clearComplete() {
    this.todoService.clearCompleted();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
