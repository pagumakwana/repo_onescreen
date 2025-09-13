import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { WebDService } from '../_appservice/webdpanel.service';
import html2pdf from 'html2pdf.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {

  invoice_logo: String = '';
  public orderdetailsmaster: any;
  order_id : any;
  grandTotalInWords: string='';
  constructor(
    public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
     private _activatedRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.order_id = this._activatedRouter.snapshot.paramMap.get('order_id');
    this.get_invoice(this.order_id);
    this._base._commonService.get_portal_config('invoice_logo').then((invoice_logo: any) => {
      this.invoice_logo = invoice_logo;
      console.log('invoice_logo', this.invoice_logo)
      this._cdr.detectChanges();
    });
  }

  get_invoice(order_id:any) {
    this._webDService.getorderdetails('Details',order_id).subscribe((resreceipt: any) => {
      let orderdetails = Array.isArray(resreceipt.data) ? resreceipt.data : [];
      this.orderdetailsmaster = orderdetails[0];

      const grandTotal = parseFloat(this.orderdetailsmaster?.amount) || 0;
      this.grandTotalInWords = `Rupees ${this.numberToWords(grandTotal)} Only`;
      this._cdr.detectChanges();
    });
  }

  numberToWords(num: number): string {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
      'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
      'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';
    if (num < 0) return 'Minus ' + this.numberToWords(Math.abs(num));

    const convert = (n: number): string => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };

    return convert(Math.floor(num));
  }

  print() {
    let printContents = document.getElementById('invoiceSection')?.innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents ?? '';
    window.print();
    document.body.innerHTML = originalContents;
    location.reload(); // Reload to restore page

  }
  
  public isDownloading: boolean = false;
  downloadPDF() {
  this.isDownloading = true; 
    const element = document.getElementById('invoiceSection');
    if (!element) return;

    const options = {
      margin: 0.5,
      filename: `Receipt_${this.order_id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };  

    html2pdf()
    .set(options)
    .from(element)
    .save()
    .then(() => {
      
      setTimeout(() => {
        this.isDownloading = false;
        this._cdr.detectChanges();
      }, 200);
    })
    .catch(() => {
      this.isDownloading = false; 
    });
    // html2pdf().set(options).from(element).save();
  }

}
