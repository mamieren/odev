import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem,
   IonButton, IonList, IonLabel, IonItemSliding, IonItemOptions, IonItemOption,
  IonToast, IonCard, IonCardContent, IonSelect, IonSelectOption, IonAlert, IonIcon 
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  walletOutline, cartOutline, busOutline, documentTextOutline, 
  cashOutline, gridOutline, alertCircleOutline, pricetagOutline,
  trashOutline
} from 'ionicons/icons';

interface Harcama {
  adi: string;
  tutar: number;
  kategori: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule, FormsModule, IonToast, IonItemOption, IonItemOptions, 
    IonItemSliding, IonLabel, IonList, IonButton, IonItem, IonInput, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
    IonSelect, IonSelectOption, IonAlert, IonIcon // IonIcon eklendi
  ],
})
export class HomePage implements OnInit {
  harcamaAdi: string = '';
  harcamaTutari: number | null = null;
  harcamaKategori: string = '';
  
  harcamalar: Harcama[] = [];
  toplamTutar: number = 0;
  
  isToastOpen: boolean = false;
  toastMesaj: string = '';
  toastRenk: string = 'dark';

  isAlertOpen: boolean = false;
  silinecekIndex: number = -1;
  alertButonlari = [
    { text: 'İptal', role: 'cancel' },
    { text: 'Sil', role: 'confirm', handler: () => { this.harcamaSil(); } }
  ];

  constructor() {
    addIcons({
      'wallet-outline': walletOutline,
      'cart-outline': cartOutline,
      'bus-outline': busOutline,
      'document-text-outline': documentTextOutline,
      'cash-outline': cashOutline,
      'grid-outline': gridOutline,
      'alert-circle-outline': alertCircleOutline,
      'pricetag-outline': pricetagOutline,
      'trash-outline': trashOutline
    });
  }

  ngOnInit(): void {
    const data = localStorage.getItem('harcamalar');
    if(data){
      this.harcamalar = JSON.parse(data);
      this.toplamHesapla();
    }
  }

  harcamaEkle(){
    if (this.harcamaAdi.trim() == '') {
      this.mesajGoster('Lütfen harcama adını giriniz!', 'danger');
      return;
    }
    if (this.harcamaTutari == null || this.harcamaTutari <= 0) {
      this.mesajGoster('Lütfen geçerli bir tutar giriniz!', 'danger');
      return;
    }
    if (this.harcamaKategori == '') {
      this.mesajGoster('Lütfen bir kategori seçiniz!', 'danger');
      return;
    }

    const yeniHarcama: Harcama = {
      adi: this.harcamaAdi,
      tutar: this.harcamaTutari,
      kategori: this.harcamaKategori
    };

    this.harcamalar.push(yeniHarcama);
    this.verileriKaydet();
    
    this.harcamaAdi = '';
    this.harcamaTutari = null;
    this.harcamaKategori = '';
    
    this.mesajGoster('Harcama başarıyla eklendi!', 'success');
  }

  silmeOnayiAc(index: number){
    this.silinecekIndex = index;
    this.isAlertOpen = true;
  }

  harcamaSil(){
    if(this.silinecekIndex > -1){
      this.harcamalar.splice(this.silinecekIndex, 1);
      this.verileriKaydet();
      this.mesajGoster('Harcama silindi.', 'dark');
    }
  }

  verileriKaydet(){
    localStorage.setItem('harcamalar', JSON.stringify(this.harcamalar));
    this.toplamHesapla();
  }

  toplamHesapla(){
    this.toplamTutar = 0;
    for(let i = 0; i < this.harcamalar.length; i++){
      this.toplamTutar += this.harcamalar[i].tutar;
    }
  }

  mesajGoster(mesaj: string, renk: string = 'dark'){
    this.toastMesaj = mesaj;
    this.toastRenk = renk;
    this.isToastOpen = true;
  }

  renkGetir(kategori: string): string {
    if(kategori === 'Gıda') return 'success';
    if(kategori === 'Ulaşım') return 'warning';
    if(kategori === 'Fatura') return 'danger';
    return 'medium';
  }

  ikonGetir(kategori: string): string {
    if(kategori === 'Gıda') return 'cart-outline';
    if(kategori === 'Ulaşım') return 'bus-outline';
    if(kategori === 'Fatura') return 'document-text-outline';
    return 'pricetag-outline';
  }
}