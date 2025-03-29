import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { environment } from "src/environments/environment";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-formly-field-input",
  template: `
    <label>
      {{ field.name }}
      <span *ngIf="field.templateOptions.required">*</span>
    </label>

    <!-- File Input -->
    <input
      *ngIf="!field.templateOptions.disabled"
      type="file"
      (change)="onFileSelected($event)"
      [formlyAttributes]="field"
    />

    <!-- Link to view file (originally opened in a new tab) -->
    <a
      *ngIf="filePath"
      [href]="getLink(filePath)"
      target="_blank"
      (click)="openModal($event, filePath)"
    >
      View Previous Stage File
    </a>

    <!-- Fullscreen Modal Overlay -->
    <div class="file-preview-modal" *ngIf="showModal">
      <div class="file-preview-modal-content">
        <!-- Close button with Font Awesome icon -->
        <i class="fas fa-times close-button" (click)="closeModal()"></i>

        <!-- iFrame for previewing the file (PDF, image, etc.) -->
        <iframe
          [src]="sanitizedPreviewUrl"
          class="preview-iframe"
        ></iframe>
      </div>
    </div>
  `,
  styles: [
    // --- Modal Overlay (covers the entire screen) ---
    `
      .file-preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.8); /* Dark overlay */
        z-index: 9999;
      }
    `,
    // --- Modal Content (the white box or container) ---
    `
      .file-preview-modal-content {
        position: relative;
        background-color: #fff;
        width: 90vw;   /* Responsive width */
        height: 90vh;  /* Responsive height */
        max-width: 1200px; /* Optional max-width for large screens */
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden; /* So iframe doesn't exceed container */
        border: 1px solid var(--border-color);
      }

      a {
        color: var(--primary); /* Your desired link color */
        text-decoration: none; /* Optional: remove underline */
      }

      a:hover {
        color: var(--primary-hover); /* Your desired link color */
        text-decoration: none; /* Optional: remove underline */
      }
    `,
    // --- Close Button (Font Awesome icon) ---
    `
      .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 2rem;
        color: var(--text-ptimary);
        cursor: pointer;
        padding: 0.5rem 1rem;
        border-radius: 5px;
      }

      .close-button:hover {
        background: linear-gradient(135deg, var(--custom-color), #ff6b6b);
      }
    `,
    // --- iFrame (occupies remaining space) ---
    `
      .preview-iframe {
        flex: 1; /* Grow to fill vertical space */
        width: 100%;
        border: none;
      }
    `,
  ],
})
export class FormlyFieldFileInputComponent extends FieldType {
  filePath: string = "";
  showModal = false;
  sanitizedPreviewUrl: SafeResourceUrl = "";

  constructor(private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    // Initialize filePath from defaultValue if available
    this.filePath = this.field.defaultValue || "";
  }

  /**
   * Called when the user selects a file from their system.
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log("Selected file:", file.name);
      this.filePath = file.name;
    }
  }

  /**
   * Build the full URL to the file (from your environment config).
   */
  getLink(link: string) {
    return environment.downloadimage + link;
  }

  /**
   * Opens the file in a modal instead of a new tab.
   * Also disables background scrolling.
   */
  openModal(event: Event, filePath: string) {
    event.preventDefault(); // Stop the default new-tab behavior

    // Disable background scrolling
    document.body.style.overflow = "hidden";

    const fullUrl = this.getLink(filePath);

    // Sanitize the URL so Angular allows it in an iframe
    this.sanitizedPreviewUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);

    this.showModal = true;
  }

  /**
   * Closes the modal, re-enables background scrolling, and clears the preview URL.
   */
  closeModal() {
    this.showModal = false;
    this.sanitizedPreviewUrl = "";

    // Re-enable background scrolling
    document.body.style.overflow = "auto";
  }
}
