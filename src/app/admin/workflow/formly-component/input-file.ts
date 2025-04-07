import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { environment } from "src/environments/environment";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from "@angular/platform-browser";

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

    <!-- Link to view file -->
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
        <!-- Simplified header with only download button -->
        <div class="file-preview-header">
          <div class="file-controls">
            <a [href]="getLink(filePath)" download class="download-button">
              <i class="fas fa-download"></i> Download
            </a>
          </div>
        </div>

        <!-- Close button positioned outside the header -->
        <a class="close-button" (click)="closeModal()">
          <i class="fas fa-times"></i>
        </a>

        <!-- Content container -->
        <div class="file-preview-body custom-scrollbar">
          <!-- Image preview (jpeg, jpg, webp) -->
          <div *ngIf="isImageFile(filePath)" class="image-preview-container">
            <div class="image-controls">
              <button (click)="zoomIn()" title="Zoom In">
                <i class="fas fa-search-plus"></i>
              </button>
              <button (click)="zoomOut()" title="Zoom Out">
                <i class="fas fa-search-minus"></i>
              </button>
              <button (click)="resetZoom()" title="Reset Zoom">
                <i class="fas fa-expand"></i>
              </button>
            </div>
            <div class="image-wrapper custom-scrollbar" #imageWrapper>
              <img [src]="sanitizedImageUrl" class="image-preview" #imagePreview />
            </div>
          </div>
          
          <!-- PDF preview -->
          <iframe 
            *ngIf="isPdfFile(filePath)" 
            [src]="sanitizedPreviewUrl" 
            class="preview-iframe">
          </iframe>
          
          <!-- Office documents preview (xls, xlsx, xlsm, ppt, pptx, pps, doc, docx) -->
          <iframe 
            *ngIf="isOfficeFile(filePath)" 
            [src]="sanitizedPreviewUrl" 
            class="preview-iframe">
          </iframe>
          
          <!-- CSV preview -->
          <div *ngIf="isCsvFile(filePath)" class="csv-preview-container custom-scrollbar">
            <table class="csv-table">
              <thead *ngIf="csvHeaders.length > 0">
                <tr>
                  <th *ngFor="let header of csvHeaders">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of csvData">
                  <td *ngFor="let cell of row">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Unsupported file type -->
          <div *ngIf="isUnsupportedFile(filePath)" class="unsupported-file">
            <i class="fas fa-file file-icon"></i>
            <p>This file type cannot be previewed directly.</p>
            <a [href]="getLink(filePath)" download class="download-link">
              <i class="fas fa-download"></i> Download File
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
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
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 9999;
      }

      .file-preview-modal-content {
        position: relative;
        background-color: #fff;
        width: 90vw;
        height: 90vh;
        max-width: 1200px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid var(--border-color);
      }

      .file-preview-header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0.75rem 1.5rem;
        border-bottom: 1px solid var(--border-color);
        background-color: #f8f9fa;
        height: 60px;
      }

      .file-controls {
        display: flex;
        align-items: center;
      }

      .download-button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: var(--primary);
        color: white;
        border-radius: 4px;
        text-decoration: none;
        font-size: 0.875rem;
        display: none;
      }

      .download-button:hover {
        background-color: var(--primary-hover);
      }

      .close-button {
        position: absolute;
        top: 0.5rem;
        right: 0.75rem;
        background-color: var(--primary);
        border: none;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 5px;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 100;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: background-color 0.2s;
      }

      .close-button:hover {
        background-color: var(--primary-hover);
      }

      .close-button i {
        font-size: 1.25rem;
        color: var(--text-primary);

      }

      .file-preview-body {
        flex: 1;
        position: relative;
        overflow: hidden;
        display: flex;
      }

      /* Custom scrollbar styling */
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
      }

      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }

      .custom-scrollbar::-webkit-scrollbar-corner {
        background: transparent;
      }

      .preview-iframe {
        width: 100%;
        height: 100%;
        border: none;
        flex: 1;
      }

      .image-preview-container {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: #f0f0f0;
        overflow: hidden;
      }

      .image-controls {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        display: flex;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.8);
        padding: 0.5rem;
        border-radius: 4px;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .image-controls button {
        background-color: var(--primary);
        color: white;
        border: none;
        width: 2rem;
        height: 2rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .image-controls button:hover {
        background-color: var(--primary-hover);
      }

      .image-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: auto;
      }

      .image-preview {
        max-width: none; /* Allow image to be larger than container when zoomed */
        max-height: none; /* Allow image to be larger than container when zoomed */
        object-fit: contain;
        transition: transform 0.2s ease;
      }

      .csv-preview-container {
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 1rem;
      }

      .csv-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }

      .csv-table th, .csv-table td {
        border: 1px solid #ddd;
        padding: 0.5rem;
        text-align: left;
        white-space: nowrap; /* Prevent text wrapping */
      }

      .csv-table th {
        position: sticky;
        top: 0;
        background-color: #f8f9fa;
        font-weight: 600;
        z-index: 1;
      }

      .csv-table tr:nth-child(even) {
        background-color: #f8f9fa;
      }

      .unsupported-file {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
      }

      .file-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: var(--primary);
      }

      .download-link {
        margin-top: 1rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background-color: var(--primary);
        color: white;
        border-radius: 4px;
        text-decoration: none;
      }

      .download-link:hover {
        background-color: var(--primary-hover);
      }

      a {
        color: var(--primary);
        text-decoration: none;
        margin-top: 5px;
        display: inline-block;
      }

      a:hover {
        color: var(--primary-hover);
      }
    `,
  ],
})
export class FormlyFieldFileInputComponent extends FieldType implements AfterViewInit {
  @ViewChild('imagePreview') imagePreview: ElementRef;
  @ViewChild('imageWrapper') imageWrapper: ElementRef;

  filePath: string = "";
  showModal = false;
  sanitizedPreviewUrl: SafeResourceUrl = "";
  sanitizedImageUrl: SafeUrl = "";
  
  // CSV preview data
  csvHeaders: string[] = [];
  csvData: string[][] = [];
  
  // Zoom properties for images
  currentScale = 1;
  minScale = 0.1;
  maxScale = 5;
  scaleStep = 0.25;

  // Supported file types
  private readonly supportedImageTypes = ['jpeg', 'jpg', 'webp'];
  private readonly supportedExcelTypes = ['xls', 'xlsx', 'xlsm'];
  private readonly supportedPowerPointTypes = ['ppt', 'pptx', 'pps'];
  private readonly supportedWordTypes = ['doc', 'docx'];
  private readonly supportedPdfTypes = ['pdf'];
  private readonly supportedCsvTypes = ['csv'];

  constructor(private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    this.filePath = this.field.defaultValue || "";
  }

  ngAfterViewInit(): void {
    // Initialize any view-related setup if needed
  }

  // File type detection methods
  isImageFile(filePath: string): boolean {
    const ext = this.getFileExtension(filePath).toLowerCase();
    return this.supportedImageTypes.includes(ext);
  }

  isPdfFile(filePath: string): boolean {
    const ext = this.getFileExtension(filePath).toLowerCase();
    return this.supportedPdfTypes.includes(ext);
  }

  isExcelFile(filePath: string): boolean {
    const ext = this.getFileExtension(filePath).toLowerCase();
    return this.supportedExcelTypes.includes(ext);
  }

  isPowerPointFile(filePath: string): boolean {
    const ext = this.getFileExtension(filePath).toLowerCase();
    return this.supportedPowerPointTypes.includes(ext);
  }

  isWordFile(filePath: string): boolean {
    const ext = this.getFileExtension(filePath).toLowerCase();
    return this.supportedWordTypes.includes(ext);
  }

  isOfficeFile(filePath: string): boolean {
    return this.isExcelFile(filePath) || 
           this.isPowerPointFile(filePath) || 
           this.isWordFile(filePath);
  }

  isCsvFile(filePath: string): boolean {
    const ext = this.getFileExtension(filePath).toLowerCase();
    return this.supportedCsvTypes.includes(ext);
  }

  isUnsupportedFile(filePath: string): boolean {
    return !this.isImageFile(filePath) && 
           !this.isPdfFile(filePath) && 
           !this.isOfficeFile(filePath) &&
           !this.isCsvFile(filePath);
  }

  getFileExtension(filePath: string): string {
    return filePath.split('.').pop() || '';
  }

  getFileName(filePath: string): string {
    return filePath.split('/').pop() || filePath;
  }

  // Zoom methods for images
  zoomIn(): void {
    this.currentScale = Math.min(this.maxScale, this.currentScale + this.scaleStep);
    this.applyImageZoom();
  }

  zoomOut(): void {
    this.currentScale = Math.max(this.minScale, this.currentScale - this.scaleStep);
    this.applyImageZoom();
  }

  resetZoom(): void {
    this.currentScale = 1;
    // Only apply zoom if modal is open
    if (this.showModal) {
      this.applyImageZoom();
    }
  }

  private applyImageZoom(): void {
    // Add null check to prevent errors
    if (this.imagePreview.nativeElement) {
      this.imagePreview.nativeElement.style.transform = `scale(${this.currentScale})`;
      
      // When zoomed in, make sure the image can be larger than the container
      if (this.currentScale > 1) {
        this.imagePreview.nativeElement.style.maxWidth = 'none';
        this.imagePreview.nativeElement.style.maxHeight = 'none';
      } else {
        this.imagePreview.nativeElement.style.maxWidth = '100%';
        this.imagePreview.nativeElement.style.maxHeight = '100%';
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log("Selected file:", file.name);
      this.filePath = file.name;
    }
  }

  getLink(link: string): string {
    return environment.downloadimage + link;
  }

  openModal(event: Event, filePath: string): void {
    event.preventDefault();
    document.body.style.overflow = "hidden";
    
    const fullUrl = this.getLink(filePath);
    
    // Reset zoom for images
    this.currentScale = 1;
    
    // Prepare different URLs based on file type
    if (this.isPdfFile(filePath)) {
      // Add PDF specific parameters
      const pdfUrl = fullUrl + "#view=FitH";
      this.sanitizedPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
    } else if (this.isOfficeFile(filePath)) {
      // Use Office Online Viewer for Office files
      const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullUrl)}`;
      this.sanitizedPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(officeViewerUrl);
    } else if (this.isImageFile(filePath)) {
      this.sanitizedImageUrl = this.sanitizer.bypassSecurityTrustUrl(fullUrl);
    } else if (this.isCsvFile(filePath)) {
      // Fetch and parse CSV data
      this.fetchCsvData(fullUrl);
    }
    
    this.showModal = true;
    
    // Wait for the DOM to update before applying zoom
    setTimeout(() => {
      if (this.isImageFile(filePath)) {
        this.applyImageZoom();
      }
    }, 100);
  }

  closeModal(): void {
    // Set showModal to false first to remove elements from DOM
    this.showModal = false;
    this.sanitizedPreviewUrl = "";
    this.sanitizedImageUrl = "";
    this.csvHeaders = [];
    this.csvData = [];
    document.body.style.overflow = "auto";
    // Don't call resetZoom here as it tries to access DOM elements that are now removed
    this.currentScale = 1;
  }

  // Fetch and parse CSV data
  private fetchCsvData(url: string): void {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(text => {
        this.parseCsvData(text);
      })
      .catch(error => {
        console.error('Error fetching CSV data:', error);
        this.csvData = [['Error loading CSV data']];
      });
  }

  // Parse CSV data
  private parseCsvData(csvText: string): void {
    // Simple CSV parser - for production, consider using a library
    const lines = csvText.split('\n');
    
    if (lines.length > 0) {
      // Assume first line is headers
      this.csvHeaders = this.parseCsvLine(lines[0]);
      
      // Parse data rows
      this.csvData = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          this.csvData.push(this.parseCsvLine(lines[i]));
        }
      }
    }
  }

  // Parse a single CSV line
  private parseCsvLine(line: string): string[] {
    // This is a simple parser that doesn't handle all CSV edge cases
    // For production, consider using a CSV parsing library
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current); // Add the last field
    return result;
  }
}