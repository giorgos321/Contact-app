import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { Contact } from '../service/contact';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { array } from '../contact-form/dialcodes.js';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css'],
})
export class EditDialogComponent implements OnInit {
  title: string;
  contact_id: string;
  contact: Contact;
  contactFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditConfirmDialogModel,
    private formBuilder: FormBuilder,
    private contactService: ContactService
  ) {
    // Update view with given values
    this.title = data.title;
    this.contact_id = data.contact_id;
    console.log(this.contact_id);
  }

  dialcodes = array;
  ngOnInit() {
    this.contactFormGroup = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(32),
      ]),
      email: new FormControl('', [Validators.email, Validators.maxLength(60)]),
      dial: new FormControl('', [
        Validators.required,
        Validators.maxLength(60),
      ]),
      number: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      color: new FormControl('', [Validators.required]),
    });
    this.contactService.cast.subscribe((contact) => {
      this.contact = contact;
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.contactFormGroup.controls[controlName].hasError(errorName);
  };

  handleSubmit() {
    if (!this.contactFormGroup.valid) {
      alert('Please fill the form correctly');
    } else {
      this.contactService
        .editContact(this.contactFormGroup.value, this.contact_id)
        .subscribe(
          (contact) => {
            console.log(`Contact Saved ${JSON.stringify(contact)}`);
            this.contactFormGroup.reset({
              name: '',
              email: '',
              dial: '',
              number: null,
              color: '',
            });
          },
          (error) => {
            alert(error);
          }
        );
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}

export class EditConfirmDialogModel {
  constructor(public title: string, public contact_id: string) {}
}
