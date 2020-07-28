import { Component, OnInit, Inject } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { Contact } from '../service/contact';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ConfirmDialogModel,
  ConfirmDialogComponent,
} from '../confirm-dialog/confirm-dialog.components';
import {
  EditDialogComponent,
  EditConfirmDialogModel,
} from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
  contact: Contact;
  contacts: Contact[];
  result: string = '';
  msg: string;
  clss: string;
  constructor(
    private contactService: ContactService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.contactService.cast.subscribe((contact) => {
      this.contact = contact;
    });

    this.contactService.refreshNeeded$.subscribe(() => {
      this.getAllContacts();
      console.log('REFRESH');
    });

    this.getAllContacts();
  }

  deleteDialog(res, contact_id) {
    if (res) {
      this.deleteContact(contact_id);
    }
  }

  deleteContact(contact_id) {
    this.contactService.deleteContact(contact_id).subscribe();
  }

  openDialog(contact_id): void {
    const message = `Are you sure you want to delete this contact?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;
      this.deleteDialog(this.result, contact_id);
    });
  }
  openDeleteManyDialog(): void {
    const message = `Are you sure you want to delete these contacts?`;

    const dialogData = new ConfirmDialogModel('Confirm Action', message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;

      if (this.result.toString() == 'true') {
        this.deleteContacts();
      }
    });
  }
  openEditDialog(contact_id): void {
    const dialogData = new EditConfirmDialogModel('Edit Contact', contact_id);

    const dialogRef = this.dialog.open(EditDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;
    });
  }
  private getAllContacts() {
    console.log('Retriving Contacts');
    this.contactService.getAllContacts().subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      },
      (error) => alert(JSON.stringify(error))
    );
    console.log(this.contacts);
  }

  deleteContacts(): void {
    const selectedContacts = this.contacts
      .filter((contact) => contact.checked)
      .map((c) => c._id);

    this.contactService.deleteContacts(selectedContacts).subscribe(
      (res) => {
        this.openSnackBar('Contacts Deleted', 'DONE');
      },
      (err) => {
        this.openSnackBar('Something went wrong', 'DONE');
      }
    );
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
