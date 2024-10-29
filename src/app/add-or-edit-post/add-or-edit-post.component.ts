import { Component, OnInit } from '@angular/core';
import { ClassifiedAdForm, ClassifiedAdsItem } from '../../models/ClassifiedAd.model';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-or-edit-post',
  templateUrl: './add-or-edit-post.component.html',
  styleUrls: ['./add-or-edit-post.component.sass'],
  standalone: true,
  imports: [EditorComponent, CommonModule, ReactiveFormsModule]
})
export class AddOrEditPostComponent implements OnInit {
  title: string = '';

  errorMessage: string = '';

  apiKey: string = 's2itx8rc1ekq634gurfmd8dvpxf3nil7a55iswysiuzgnqw6';

  canGoBack: boolean = false;

  addOrEditPostForm!: FormGroup;

  init: EditorComponent['init'] = {
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
    height: 250,
  };


  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.title = 'Add New Classified Ad';
    this.addOrEditPostForm = this.formBuilder.group({
      title: [''],
      description: [''],
      address: [''],
      thumbnail: [''],
      phone: [''],
      price: [0],
      email: [''],
    });
  }

  goBack() {}

  submitForm() {
    // console.log("the form was submitted:", this.addOrEditPostForm.value);
    if (this.addOrEditPostForm.valid) {
      const formData: ClassifiedAdsItem = <ClassifiedAdsItem>{
        title: this.addOrEditPostForm.value.title,
        description: this.addOrEditPostForm.value.description,
        address: this.addOrEditPostForm.value.address,
        thumbnail: this.addOrEditPostForm.value.thumbnail,
        phone: this.addOrEditPostForm.value.phone,
        price: this.addOrEditPostForm.value.price,
        email: this.addOrEditPostForm.value.email,
      };

      console.log("the form was submitted:", formData);
    }
  }

}
