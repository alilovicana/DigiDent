import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoaderComponent } from '../components/loader/loader.component';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(
    private $dialog : MatDialog
  ) { }

  private loader : MatDialogRef<LoaderComponent> | undefined = undefined;

  public start(){
    if(!this.loader)
    this.loader = this.$dialog.open(LoaderComponent, {
      disableClose: true
    })
  }

  public stop(){
    if(this.loader){
      this.loader.close();
      this.loader = undefined;
    }
  }
}
