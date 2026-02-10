import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CadastroService } from '../../shared/services/cadastro.service';
import { Router, ɵEmptyOutletComponent } from '@angular/router';
import { BehaviorSubject, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { Cidade, Estado, IbgeService } from '../../shared/services/ibge.service';
import { cpfValidator } from '../../shared/validators/cpf.validator';
import { emailExistenteValidator } from '../../shared/validators/emailExistente.validator';
import { EmailValidatorService } from '../../shared/services/email-validator.service';
import { FormConfig } from '../../shared/models/form-config.interface';
import { DynanmicFormService } from '../../shared/services/dynanmic-form.service';
import { getDadosPessoaisConfig } from '../../config/dados-pessoais-form.config';
import { FormFieldBase } from '../../shared/models/form-field-base.interface';

export const senhasIguaisValidator: ValidatorFn = 
(control: AbstractControl): ValidationErrors | null => {
  const senha  = control.get('senha');
  const confirmaSenha = control.get('confirmaSenha');

  return senha && confirmaSenha && senha.value === confirmaSenha.value ? 
  null : {senhasNaoIguais: true};
}


@Component({
  selector: 'app-dados-pessoais-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    ɵEmptyOutletComponent
],
  templateUrl: './dados-pessoais-form.component.html',
  styleUrls: ['./dados-pessoais-form.component.scss']
})
export class DadosPessoaisFormComponent implements OnInit{
  dadosPessoaisForm!: FormGroup;
  formConfig!: FormConfig;

  estado$!: Observable<Estado[]>;
  cidade$!: Observable<Cidade[]>;

  carregandoCidades$ = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cadastroService: CadastroService,
    private ibgeService: IbgeService,
    private emailService: EmailValidatorService,
    private dynamicFormService: DynanmicFormService
  ){
    this.dynamicFormService.registerFormConfig('dadosPessoaisForm', getDadosPessoaisConfig);
  }

  ngOnInit(): void {
    this.formConfig = this.dynamicFormService.getFormConfig('dadosPessoaisForm');

    const formOptions: AbstractControlOptions = {
        validators: senhasIguaisValidator
    };


    this.dadosPessoaisForm = this.dynamicFormService.createFormGroup(this.formConfig, 
      {validators: senhasIguaisValidator})

    this.carregarEstados();
    this.configurarListernerEstado();
  }

  onAnterior(): void {
    this.salvarDadosAtuais();
    this.router.navigate(['/cadastro/area-atuacao']);
  }

  onProximo(): void {
    if(this.dadosPessoaisForm.valid){
      this.salvarDadosAtuais();
      this.router.navigate(['/cadastro/confirmacao']);
    }else{
      this.dadosPessoaisForm.markAllAsTouched();
    }
  }

  isFieldType(field: FormFieldBase, type: string): boolean {
    return field.type === type;
  }

  private carregarEstados(): void{
    this.estado$ = this.ibgeService.getEstados();
  }

  private configurarListernerEstado(): void {
    const estadoControl = this.dadosPessoaisForm.get('estado');

    if(estadoControl){
      this.cidade$ = estadoControl.valueChanges.pipe(
        startWith(''),
        tap(() => {
          this.resetarCidade();
          this.carregandoCidades$.next(true);
        }),
        switchMap(uf => {
          if(uf){
            console.log('passou aqui');
            return this.ibgeService.getCidades(uf).
            pipe(
              tap(() => this.carregandoCidades$.next(false))
            )
          }
          this.carregandoCidades$.next(false);
          return of([]);
        })
      )
    }
  }

  private salvarDadosAtuais(){
    const formValue = this.dadosPessoaisForm.value;

    this.cadastroService.updateCadastroData({
      nomeCompleto: formValue.nomeCompleto,
      estado: formValue.estado,
      cidade: formValue.cidade,
      email: formValue.email,
      senha: formValue.senha
    })
  }

  private resetarCidade(): void {
    this.dadosPessoaisForm.get('cidade')?.setValue('');
  }
}
