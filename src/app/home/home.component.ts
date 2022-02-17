import { Component, OnInit, ViewChild } from '@angular/core';
import { MiaTableComponent, MiaTableConfig, MiaTableEditableComponent, } from '@agencycoda/mia-table';
import { ClientService } from '../services/client.service'
import { MiaField, MiaFormConfig, MiaFormModalComponent, MiaFormModalConfig } from '@agencycoda/mia-form';
import { Validators } from '@angular/forms';
import { Client } from '../entities/client';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogueComponent } from '../confirm-dialogue/confirm-dialogue.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('tableComp') tableCmp! : MiaTableComponent;
  @ViewChild('tableEditable') tableEditable!: MiaTableEditableComponent;

  tableConfig: MiaTableConfig = new MiaTableConfig();

  item: any;

  constructor(public clientService: ClientService, public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.loadConfig();
  }


  openModal(){
    let data = new MiaFormModalConfig();
    data.item = this.item;
    data.service = this.clientService;
    data.titleNew = 'Create User';
    data.titleEdit = 'Edit User';
    let config = new MiaFormConfig();
    config.hasSubmit = false;
    config.fields = [
      { key: 'firstname', type: MiaField.TYPE_STRING, label: 'Name', validators:
      [ Validators.required]
      },
      { key: 'lastname', type: MiaField.TYPE_STRING, label: 'Surname'
      },
      { key: 'email', type: MiaField.TYPE_STRING, label: 'Email', validators:
        [Validators.required, Validators.email] },
    ];
    config.errorMessages = [
      { key: 'required', message: 'The "%label%" is required.' },
      { key: 'email', message: 'The "%label%" is must be a valid eamil.' }
    ];
    data.config = config;
    return this.dialog.open(MiaFormModalComponent, {
    width: '520px',
    panelClass: 'modal-full-width-mobile',
    data: data
    }).afterClosed();
  }

  onClickAdd() {
    this.item = new Client();
    this.openModal().subscribe(()=>{
      this.tableCmp.loadItems();
    });
    
  }

  loadConfig() {
    this.tableConfig.service = this.clientService;
    this.tableConfig.id = 'table-test';
    this.tableConfig.columns = [
      { key: 'selection', type: 'selection', title: '' },
      { key: 'id', type: 'string', title: 'ID', field_key: 'id' },
      { key: 'firstname', type: 'string', title: 'Name', field_key: 'firstname' },
      { key: 'lastname', type: 'string', title: 'Surname', field_key: 'lastname' },
      { key: 'email', type: 'string', title: 'Email', field_key: 'email'},
      { key: 'more', type: 'more', title: '', extra: {
        actions: [
          { icon: 'create', title: 'Edit', key: 'edit' },
          { icon: 'delete', title: 'Erase', key: 'remove' },
        ]
      } }
    ];

    this.tableConfig.loadingColor = 'red';
    this.tableConfig.hasEmptyScreen = true;
    this.tableConfig.emptyScreenTitle = 'No data to show';
    this.tableConfig.onClick.subscribe(result => {
      if(result.key=='edit'){
        this.item = result.item;
        this.openModal();
      }
      if(result.key=='remove'){
        const dialogRef = this.dialog.open(ConfirmDialogueComponent, {
          maxWidth: "400px",
        });
    
        dialogRef.afterClosed().subscribe(dialogResult => {
          if(dialogResult){
            this.clientService.remove(result.item["id"]).then(()=>{
            this.tableCmp.loadItems();
            });
          }
        });
      }
    });

  }

}
