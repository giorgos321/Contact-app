import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Contact } from './contact';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contact = new BehaviorSubject<Contact>({
    _id: '',
    name: '',
    email: '',
    number: null,
    color: '',
    checked: false,
  });

  cast = this.contact.asObservable();
  constructor(private httpClient: HttpClient) {}

  private _refreshNeeded$ = new Subject<void>();
  refreshNeeded$ = this._refreshNeeded$.asObservable();

  get refreshneeded$() {
    return this._refreshNeeded$;
  }

  createContact(contact: Contact): Observable<Contact> {
    console.log(contact);
    return this.httpClient
      .post<Contact>('http://localhost:7000/api/contacts', contact)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          console.log(this.refreshNeeded$);
        })
      );
  }
  editContact(contact: Contact, contact_id): Observable<Contact> {
    return this.httpClient
      .put<Contact>(`http://localhost:7000/api/contacts/${contact_id}`, contact)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          console.log(this.refreshNeeded$);
        })
      );
  }
  deleteContact(contact_id: string): Observable<object> {
    console.log(contact_id);
    return this.httpClient
      .delete(`http://localhost:7000/api/contacts/${contact_id}`)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          console.log(this.refreshNeeded$);
        })
      );
  }
  getAllContacts(): Observable<Contact[]> {
    return this.httpClient.get<Contact[]>('http://localhost:7000/api/contacts');
  }

  deleteContacts(ids: string[]): Observable<object> {
    const data = { ids: ids };

    return this.httpClient
      .post<any>(`http://localhost:7000/api/contacts/bulkdelete/`, data)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
          console.log(this.refreshNeeded$);
        })
      );
  }
}
