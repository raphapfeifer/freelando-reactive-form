import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CadastroService } from '../../shared/services/cadastro.service';
import { Router } from '@angular/router';

export const senhasIguaisValidator: ValidatorFn = 
(control: AbstractControl): ValidationErrors | null => {
  const senha  = control.get('senha');
  const confirmaSenha = control.get('confirmaSenha');

  return senha && confirmaSenha && senha.value !== confirmaSenha.value ? 
  null : {senhasNaoIguais: true};
}


@Component({
  selector: 'app-dados-pessoais-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './dados-pessoais-form.component.html',
  styleUrls: ['./dados-pessoais-form.component.scss']
})
export class DadosPessoaisFormComponent implements OnInit{
  dadosPessoaisForm!: FormGroup;

  estados = [
    {sigla: 'AC', nome: 'Acre'}
  ]

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cadastroService: CadastroService
  ){}

  ngOnInit(): void {
    const formOptions: AbstractControlOptions = {
        validators: senhasIguaisValidator
    };


    this.dadosPessoaisForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', Validators.required]
    }, formOptions)
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
}
