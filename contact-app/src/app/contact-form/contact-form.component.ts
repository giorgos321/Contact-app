import { Component, OnInit } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { Contact } from '../service/contact';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { array } from './dialcodes.js';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
})
export class ContactFormComponent implements OnInit {
  contact: Contact;
  contactFormGroup: FormGroup;
  color: string;
  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private _snackBar: MatSnackBar
  ) {}
  dialcodes = array;

  ngOnInit(): void {
    this.contactFormGroup = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(32),
      ]),
      email: new FormControl('', [Validators.email, Validators.maxLength(60)]),
      dial: new FormControl('', [Validators.required]),
      number: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      color: '',
    });
    this.contactService.cast.subscribe((contact) => {
      this.contact = contact;
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.contactFormGroup.controls[controlName].hasError(errorName);
  };
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
  handleSubmit() {
    if (!this.contactFormGroup.valid) {
      this.openSnackBar('Please fill the form correctly', 'DONE');
    } else {
      this.contactService.createContact(this.contactFormGroup.value).subscribe(
        (contact) => {
          this.openSnackBar('Contact Saved', 'DONE');
          this.contactFormGroup.reset({
            name: '',
            email: '',
            dial: '',
            number: null,
            color: '',
          });
        },
        (error) => {
          this.openSnackBar(error.error.msg, 'DONE');
        }
      );
    }
  }
}
